import {
  getGoogleTokens,
  getValidAccessToken,
  GoogleToken,
} from "./google-token";

const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  backgroundColor: string;
  foregroundColor: string;
  primary?: boolean;
  accessRole: string;
  tokenEmail?: string; // 어떤 구글 계정의 캘린더인지
}

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
 * 연결된 모든 구글 계정의 토큰 가져오기
 */
export const getGoogleTokensWithRefresh = async (): Promise<
  { token: GoogleToken; accessToken: string }[]
> => {
  const tokens = await getGoogleTokens();
  const validTokens: { token: GoogleToken; accessToken: string }[] = [];

  for (const token of tokens) {
    const accessToken = await getValidAccessToken(token);
    if (accessToken) {
      validTokens.push({ token, accessToken });
    }
  }

  return validTokens;
};

/**
 * 모든 연결된 계정의 캘린더 목록 조회
 */
export const fetchCalendarList = async (): Promise<GoogleCalendar[]> => {
  const tokenPairs = await getGoogleTokensWithRefresh();

  if (tokenPairs.length === 0) {
    return [];
  }

  const allCalendars: GoogleCalendar[] = [];

  for (const { token, accessToken } of tokenPairs) {
    try {
      const response = await fetch(
        `${CALENDAR_API_BASE}/users/me/calendarList`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        console.error(`Failed to fetch calendars for ${token.email}`);
        continue;
      }

      const data = await response.json();
      const calendars = (data.items || []).map((cal: GoogleCalendar) => ({
        ...cal,
        tokenEmail: token.email,
      }));

      allCalendars.push(...calendars);
    } catch (error) {
      console.error(`Error fetching calendars for ${token.email}:`, error);
    }
  }

  return allCalendars;
};

/**
 * 특정 날짜의 일정 조회 (모든 연결된 계정에서)
 */
export const fetchEventsForDate = async (
  calendarIds: string[],
  date: Date,
): Promise<GoogleEvent[]> => {
  const tokenPairs = await getGoogleTokensWithRefresh();

  if (tokenPairs.length === 0) {
    return [];
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const timeMin = startOfDay.toISOString();
  const timeMax = endOfDay.toISOString();

  // 캘린더 목록 가져와서 매핑
  const calendarsData = await fetchCalendarList();
  const calendarMap = new Map(calendarsData.map((c) => [c.id, c]));

  const allEvents: GoogleEvent[] = [];

  for (const { token, accessToken } of tokenPairs) {
    // 이 계정에 해당하는 캘린더만 필터링
    const accountCalendarIds = calendarIds.filter((id) => {
      const cal = calendarMap.get(id);
      return cal?.tokenEmail === token.email;
    });

    for (const calendarId of accountCalendarIds) {
      try {
        const params = new URLSearchParams({
          timeMin,
          timeMax,
          singleEvents: "true",
          orderBy: "startTime",
        });

        const response = await fetch(
          `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          console.error(`Failed to fetch events for calendar ${calendarId}`);
          continue;
        }

        const data = await response.json();
        const calendar = calendarMap.get(calendarId);

        const events = (data.items || []).map((event: GoogleEvent) => ({
          ...event,
          calendarId,
          calendarColor: calendar?.backgroundColor,
          tokenEmail: token.email,
        }));

        allEvents.push(...events);
      } catch (error) {
        console.error(`Error fetching events for ${calendarId}:`, error);
      }
    }
  }

  // 시작 시간으로 정렬
  return allEvents.sort((a, b) => {
    const aTime = a.start.dateTime || a.start.date || "";
    const bTime = b.start.dateTime || b.start.date || "";
    return aTime.localeCompare(bTime);
  });
};

/**
 * 일정의 시작/종료 시간을 Date 객체로 변환
 */
export const getEventTimes = (
  event: GoogleEvent,
): { start: Date; end: Date; isAllDay: boolean } => {
  const isAllDay = !event.start.dateTime;

  const start = event.start.dateTime
    ? new Date(event.start.dateTime)
    : new Date(event.start.date + "T00:00:00");

  const end = event.end.dateTime
    ? new Date(event.end.dateTime)
    : new Date(event.end.date + "T23:59:59");

  return { start, end, isAllDay };
};
