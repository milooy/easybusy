"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  fetchCalendarList,
  fetchEventsForDate,
  GoogleCalendar,
  GoogleEvent,
} from '@/lib/google-calendar';
import { getGoogleTokens } from '@/lib/google-token';

const SELECTED_CALENDARS_KEY = 'selectedCalendarIds';

export const useGoogleCalendar = () => {
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedEmails, setConnectedEmails] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // null = 로딩 중

  // localStorage에서 선택된 캘린더 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(SELECTED_CALENDARS_KEY);
    if (stored) {
      try {
        setSelectedCalendarIds(JSON.parse(stored));
      } catch {
        // 무시
      }
    }
  }, []);

  // 선택된 캘린더 저장
  useEffect(() => {
    if (selectedCalendarIds.length > 0) {
      localStorage.setItem(SELECTED_CALENDARS_KEY, JSON.stringify(selectedCalendarIds));
    }
  }, [selectedCalendarIds]);

  // 연결 상태 확인
  const checkConnection = useCallback(async () => {
    try {
      const tokens = await getGoogleTokens();
      const emails = tokens.map(t => t.email);
      setConnectedEmails(emails);
      setIsConnected(emails.length > 0);
      return emails.length > 0;
    } catch {
      setIsConnected(false);
      return false;
    }
  }, []);

  // 캘린더 목록 조회
  const loadCalendars = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 먼저 연결 상태 확인
      const connected = await checkConnection();
      if (!connected) {
        setCalendars([]);
        setLoading(false);
        return;
      }

      const list = await fetchCalendarList();
      setCalendars(list);

      // 처음 로드 시 모든 캘린더 선택
      if (selectedCalendarIds.length === 0 && list.length > 0) {
        const allIds = list.map((c) => c.id);
        setSelectedCalendarIds(allIds);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendars');
    } finally {
      setLoading(false);
    }
  }, [selectedCalendarIds.length, checkConnection]);

  // 일정 조회
  const loadEvents = useCallback(async () => {
    if (selectedCalendarIds.length === 0) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const eventList = await fetchEventsForDate(selectedCalendarIds, selectedDate);
      setEvents(eventList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [selectedCalendarIds, selectedDate]);

  // 캘린더 선택 토글
  const toggleCalendar = useCallback((calendarId: string) => {
    setSelectedCalendarIds((prev) =>
      prev.includes(calendarId)
        ? prev.filter((id) => id !== calendarId)
        : [...prev, calendarId]
    );
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

  return {
    calendars,
    selectedCalendarIds,
    events,
    selectedDate,
    loading,
    error,
    isConnected,
    connectedEmails,
    loadCalendars,
    loadEvents,
    toggleCalendar,
    goToDate,
    goToPrevDay,
    goToNextDay,
    goToToday,
  };
};
