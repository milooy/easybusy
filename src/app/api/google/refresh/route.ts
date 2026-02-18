import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { tokenId } = await request.json();

    if (!tokenId) {
      return NextResponse.json({ error: "tokenId is required" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // 현재 로그인한 사용자 확인 (RLS 보안)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // DB에서 토큰 조회 (RLS로 본인 토큰만 접근 가능)
    const { data: token, error: tokenError } = await supabase
      .from("google_tokens")
      .select("*")
      .eq("id", tokenId)
      .single();

    if (tokenError || !token) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    // Google OAuth 토큰 갱신 요청 (서버사이드에서 client_secret 사용)
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: token.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google token refresh failed:", errorText);
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: 502 }
      );
    }

    const data: { access_token: string; expires_in: number } = await response.json();

    const newExpiresAt = new Date(
      Date.now() + data.expires_in * 1000
    ).toISOString();

    // DB 업데이트
    const { error: updateError } = await supabase
      .from("google_tokens")
      .update({
        access_token: data.access_token,
        expires_at: newExpiresAt,
      })
      .eq("id", tokenId);

    if (updateError) {
      console.error("Failed to update token in DB:", updateError);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    return NextResponse.json({ access_token: data.access_token });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
