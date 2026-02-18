"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCalendarList,
  fetchEventsForDate,
  getGoogleTokensWithRefresh,
} from "@/lib/google-calendar";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";

export const useGoogleCalendar = () => {
  const { user } = useAuth();
  const userId = user?.id;

  // useLocalStorage 훅 사용으로 SSR 안전성 및 코드 단순화
  const [selectedCalendarIds, setSelectedCalendarIds] = useLocalStorage<
    string[]
  >(STORAGE_KEYS.SELECTED_CALENDARS, []);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 토큰 조회 (1회만 - 다른 쿼리에서 재사용)
  const { data: tokenPairs = [], isLoading: isTokensLoading } = useQuery({
    queryKey: ["googleTokenPairs", userId],
    queryFn: () => getGoogleTokensWithRefresh(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
  });

  const isConnected = tokenPairs.length > 0;
  const connectedEmails = tokenPairs.map((t) => t.token.email);

  // 캘린더 목록 조회 (tokenPairs 전달로 중복 조회 방지)
  const {
    data: calendars = [],
    isLoading: isCalendarsLoading,
    error: calendarsError,
  } = useQuery({
    queryKey: ["googleCalendars", userId],
    queryFn: () => fetchCalendarList(tokenPairs),
    enabled: !!userId && tokenPairs.length > 0,
    staleTime: 1000 * 60 * 5, // 5분
    select: (data) => {
      // 처음 로드 시 모든 캘린더 선택 (localStorage에 저장된 값이 없을 때만)
      if (selectedCalendarIds.length === 0 && data.length > 0) {
        const allIds = data.map((c) => c.id);
        setSelectedCalendarIds(allIds);
      }
      return data;
    },
  });

  // 날짜 문자열 (쿼리 키용)
  const dateKey = useMemo(() => {
    return selectedDate.toISOString().split("T")[0];
  }, [selectedDate]);

  // 캘린더 ID를 정렬된 문자열로 변환 (Query Key 안정성)
  const calendarKey = useMemo(() => {
    return [...selectedCalendarIds].sort().join(",");
  }, [selectedCalendarIds]);

  // 일정 조회 (tokenPairs 전달로 중복 조회 방지)
  const {
    data: events = [],
    isLoading: isEventsLoading,
    error: eventsError,
  } = useQuery({
    queryKey: ["googleEvents", userId, dateKey, calendarKey],
    queryFn: () =>
      fetchEventsForDate(
        selectedCalendarIds,
        selectedDate,
        calendars,
        tokenPairs
      ),
    enabled:
      !!userId &&
      tokenPairs.length > 0 &&
      selectedCalendarIds.length > 0 &&
      calendars.length > 0,
    staleTime: 1000 * 60 * 2, // 2분
  });

  // 캘린더 선택 토글 (useLocalStorage가 자동으로 저장)
  const toggleCalendar = useCallback(
    (calendarId: string) => {
      setSelectedCalendarIds((prev) => {
        return prev.includes(calendarId)
          ? prev.filter((id) => id !== calendarId)
          : [...prev, calendarId];
      });
    },
    [setSelectedCalendarIds]
  );

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

  // 로딩 상태 (user가 없으면 아직 로딩 중)
  const loading =
    !userId || isTokensLoading || isCalendarsLoading || isEventsLoading;

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
    isConnected: !userId || isTokensLoading ? null : isConnected,
    connectedEmails,
    toggleCalendar,
    goToDate,
    goToPrevDay,
    goToNextDay,
    goToToday,
  };
};
