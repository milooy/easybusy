import { supabase } from './supabase';
import { withRetry } from './retry';

export interface GoogleToken {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

/**
 * 현재 사용자의 모든 구글 토큰 조회
 * @param userId 사용자 ID (전달하면 getUser() 호출 생략)
 */
export const getGoogleTokens = async (userId?: string): Promise<GoogleToken[]> => {
  let uid = userId;

  // userId가 없으면 getUser() 호출 (fallback)
  if (!uid) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    uid = user?.id;
  }

  if (!uid) {
    return [];
  }

  const { data, error } = await supabase
    .from("google_tokens")
    .select("*")
    .eq("user_id", uid);

  if (error) {
    console.error("Failed to fetch google tokens:", error);
    return [];
  }

  return data || [];
};

/**
 * 토큰이 만료되었는지 확인 (5분 여유)
 */
export const isTokenExpired = (expiresAt: string): boolean => {
  const expiryTime = new Date(expiresAt).getTime();
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5분

  return now >= expiryTime - bufferMs;
};

/**
 * 서버 API를 통한 Google OAuth 토큰 갱신 요청 (내부 함수)
 * GOOGLE_CLIENT_SECRET은 서버사이드에서만 사용 가능하므로 API 라우트로 위임
 */
const requestTokenRefresh = async (
  token: GoogleToken
): Promise<{ access_token: string }> => {
  const response = await fetch("/api/google/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokenId: token.id }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Token refresh failed: ${response.status} - ${errorData.error || "unknown"}`);
  }

  return response.json();
};

/**
 * 토큰 갱신 (지수 백오프 재시도 적용)
 */
export const refreshGoogleToken = async (
  token: GoogleToken
): Promise<string | null> => {
  try {
    // 3회 재시도, 1초 → 2초 → 4초 딜레이
    const data = await withRetry(() => requestTokenRefresh(token), {
      maxRetries: 3,
      baseDelayMs: 1000,
    });

    return data.access_token;
  } catch (error) {
    console.error("Token refresh error after retries:", error);
    return null;
  }
};

/**
 * 유효한 access token 가져오기 (필요시 갱신)
 */
export const getValidAccessToken = async (token: GoogleToken): Promise<string | null> => {
  if (!isTokenExpired(token.expires_at)) {
    return token.access_token;
  }

  return refreshGoogleToken(token);
};

/**
 * 구글 계정 연결 해제
 */
export const disconnectGoogleAccount = async (tokenId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('google_tokens')
    .delete()
    .eq('id', tokenId);

  if (error) {
    console.error('Failed to disconnect:', error);
    return false;
  }

  return true;
};

/**
 * 구글 연결 여부 확인
 */
export const hasGoogleConnection = async (): Promise<boolean> => {
  const tokens = await getGoogleTokens();
  return tokens.length > 0;
};
