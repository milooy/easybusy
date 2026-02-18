/**
 * 날짜/시간 포맷팅 유틸리티
 */

/**
 * 시간을 HH:mm 형식으로 포맷팅 (24시간제)
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * 날짜를 '2024년 1월 25일 금요일' 형식으로 포맷팅
 */
export const formatDateFull = (date: Date): string => {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

/**
 * 날짜를 '2024년 1월 25일' 형식으로 포맷팅 (요일 제외)
 */
export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 날짜/시간을 상황에 맞게 포맷팅
 * @param date 날짜
 * @param isAllDay 종일 이벤트 여부
 */
export const formatDateTime = (date: Date, isAllDay: boolean): string => {
  if (isAllDay) {
    return formatDateShort(date);
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 오늘 날짜인지 확인
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

/**
 * 날짜를 YYYY-MM-DD 형식 문자열로 변환
 */
export const toDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
