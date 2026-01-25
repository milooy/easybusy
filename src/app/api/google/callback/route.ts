import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + "/api/google/callback";

interface GoogleTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface GoogleUserInfo {
  email: string;
  name: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/?error=google_auth_denied", request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    // 1. code를 token으로 교환
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange failed:", errorData);
      return NextResponse.redirect(
        new URL("/?error=token_exchange_failed", request.url),
      );
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // 2. 구글 사용자 정보 가져오기
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(
        new URL("/?error=userinfo_failed", request.url),
      );
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();

    // 3. Supabase 세션에서 현재 사용자 확인
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

    // 서비스 롤 키로 Supabase 클라이언트 생성 (RLS 우회)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 쿠키에서 Supabase 세션 토큰 가져오기
    const accessToken = cookieStore.get("sb-access-token")?.value;

    if (!accessToken) {
      return NextResponse.redirect(
        new URL("/login?error=not_logged_in", request.url),
      );
    }

    // 일반 클라이언트로 사용자 확인
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.redirect(
        new URL("/login?error=session_invalid", request.url),
      );
    }

    // 4. 토큰 저장 (upsert)
    const expiresAt = new Date(
      Date.now() + tokens.expires_in * 1000,
    ).toISOString();

    const { error: upsertError } = await supabaseAdmin
      .from("google_tokens")
      .upsert(
        {
          user_id: user.id,
          email: userInfo.email,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt,
        },
        {
          onConflict: "user_id,email",
        },
      );

    if (upsertError) {
      console.error("Token save failed:", upsertError);
      return NextResponse.redirect(
        new URL("/?error=token_save_failed", request.url),
      );
    }

    // 성공
    return NextResponse.redirect(
      new URL("/?google_connected=true", request.url),
    );
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(new URL("/?error=unknown", request.url));
  }
}
