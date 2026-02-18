/**
 * 애플리케이션 전역 상수
 */

/**
 * 색상 상수
 */
export const COLORS = {
  /** Google Calendar 기본 색상 (Google Blue) */
  GOOGLE_CALENDAR_DEFAULT: "#4285f4",
} as const;

/**
 * 로컬스토리지 키
 */
export const STORAGE_KEYS = {
  SELECTED_CALENDARS: "easybusy:selectedCalendars",
  USER_SETTINGS: "easybusy:userSettings",
} as const;

/**
 * 캐시 설정 (밀리초)
 */
export const CACHE_TIME = {
  /** 5분 */
  SHORT: 1000 * 60 * 5,
  /** 30분 */
  MEDIUM: 1000 * 60 * 30,
  /** 2분 */
  EVENTS: 1000 * 60 * 2,
} as const;
