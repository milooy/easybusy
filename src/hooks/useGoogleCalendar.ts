"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCalendarList, fetchEventsForDate } from "@/lib/google-calendar";
import { getGoogleTokens } from "@/lib/google-token";

const SELECTED_CALENDARS_KEY = "selectedCalendarIds";

// localStorage에서 선택된 캘린더 ID 불러오기
const getStoredCalendarIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(SELECTED_CALENDARS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// 선택된 캘린더 ID 저장
const saveCalendarIds = (ids: string[]) => {
  if (typeof window === "undefined") return;
  if (ids.length > 0) {
    localStorage.setItem(SELECTED_CALENDARS_KEY, JSON.stringify(ids));
  }
};

export const useGoogleCalendar = () => {
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>(
    getStoredCalendarIds
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 연결된 Google 계정 조회
  const {
    data: connectionData,
    isLoading: isConnectionLoading,
  } = useQuery({
    queryKey: ["googleTokens"],
    queryFn: async () => {
      const tokens = await getGoogleTokens();
      return {
        emails: tokens.map((t) => t.email),
        isConnected: tokens.length > 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  const isConnected = connectionData?.isConnected ?? null;
  const connectedEmails = connectionData?.emails ?? [];

  // 캘린더 목록 조회
  const {
    data: calendars = [],
    isLoading: isCalendarsLoading,
    error: calendarsError,
  } = useQuery({
    queryKey: ["googleCalendars"],
    queryFn: fetchCalendarList,
    enabled: isConnected === true,
    staleTime: 1000 * 60 * 5, // 5분
    select: (data) => {
      // 처음 로드 시 모든 캘린더 선택 (localStorage에 저장된 값이 없을 때만)
      if (selectedCalendarIds.length === 0 && data.length > 0) {
        const allIds = data.map((c) => c.id);
        setSelectedCalendarIds(allIds);
        saveCalendarIds(allIds);
      }
      return data;
    },
  });

  // 날짜 문자열 (쿼리 키용)
  const dateKey = useMemo(() => {
    return selectedDate.toISOString().split("T")[0];
  }, [selectedDate]);

  // 일정 조회
  const {
    data: events = [],
    isLoading: isEventsLoading,
    error: eventsError,
  } = useQuery({
    queryKey: ["googleEvents", dateKey, selectedCalendarIds],
    queryFn: () => fetchEventsForDate(selectedCalendarIds, selectedDate, calendars),
    enabled: isConnected === true && selectedCalendarIds.length > 0 && calendars.length > 0,
    staleTime: 1000 * 60 * 2, // 2분
  });

  // 캘린더 선택 토글
  const toggleCalendar = useCallback((calendarId: string) => {
    setSelectedCalendarIds((prev) => {
      const newIds = prev.includes(calendarId)
        ? prev.filter((id) => id !== calendarId)
        : [...prev, calendarId];
      saveCalendarIds(newIds);
      return newIds;
    });
  }, []);

  // 날짜 변경
  const goToDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const goToPrevDay = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  // 로딩 상태
  const loading = isConnectionLoading || isCalendarsLoading || isEventsLoading;

  // 에러 메시지
  const error = calendarsError
    ? calendarsError instanceof Error
      ? calendarsError.message
      : "Failed to load calendars"
    : eventsError
      ? eventsError instanceof Error
        ? eventsError.message
        : "Failed to load events"
      : null;

  return {
    calendars,
    selectedCalendarIds,
    events,
    selectedDate,
    loading,
    error,
    isConnected: isConnectionLoading ? null : isConnected,
    connectedEmails,
    toggleCalendar,
    goToDate,
    goToPrevDay,
    goToNextDay,
    goToToday,
  };
};
