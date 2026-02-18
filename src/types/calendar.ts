/**
 * Google Calendar API 타입 정의
 */

/**
 * 이벤트 시간 타입 (종일 이벤트 vs 시간 지정 이벤트)
 */
export type EventDateTime =
  | { dateTime: string; timeZone?: string; date?: never }
  | { date: string; dateTime?: never; timeZone?: never };

/**
 * Google Calendar 정보
 */
export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  backgroundColor: string;
  foregroundColor: string;
  primary?: boolean;
  accessRole: string;
  /** 어떤 구글 계정의 캘린더인지 */
  tokenEmail?: string;
}

/**
 * Google Calendar 이벤트
 */
export interface GoogleEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  htmlLink: string;
  colorId?: string;
  calendarId?: string;
  calendarColor?: string;
  tokenEmail?: string;
}

/**
 * 이벤트 시간 정보 (파싱된 형태)
 */
export interface EventTimes {
  start: Date;
  end: Date;
  isAllDay: boolean;
}

/**
 * 토큰과 액세스 토큰 쌍
 */
export interface TokenPair {
  token: GoogleToken;
  accessToken: string;
}

/**
 * Google OAuth 토큰
 */
export interface GoogleToken {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}
