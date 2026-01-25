"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import {
  DailyTimeline,
  DateNavigation,
  EventDetailModal,
  CalendarSelector,
  GoogleConnectButton,
} from "@/components/calendar";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { GoogleEvent } from "@/lib/google-calendar";
import { css } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";
import { Footer } from "@/components/Footer";

function HomePage() {
  const {
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
    goToPrevDay,
    goToNextDay,
    goToToday,
  } = useGoogleCalendar();

  const [selectedEvent, setSelectedEvent] = useState<GoogleEvent | null>(null);
  const [showCalendarSelector, setShowCalendarSelector] = useState(false);

  // 초기 로드
  useEffect(() => {
    loadCalendars();
  }, [loadCalendars]);

  // 캘린더 또는 날짜 변경 시 일정 조회
  useEffect(() => {
    if (selectedCalendarIds.length > 0) {
      loadEvents();
    }
  }, [selectedCalendarIds, selectedDate, loadEvents]);

  // 연결 상태 확인 중
  if (isConnected === null) {
    return (
      <div className={css({ minH: "screen", bg: "gray.50", display: "flex", flexDirection: "column" })}>
        <div className={css({ flex: "1", display: "flex", alignItems: "center", justifyContent: "center" })}>
          <div className={css({ color: "gray.500" })}>로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // 구글 연결 안 됨
  if (!isConnected) {
    return (
      <div className={css({ minH: "screen", bg: "gray.50", display: "flex", flexDirection: "column" })}>
        <div className={css({ flex: "1" })}>
          <div className={css({ maxW: "md", mx: "auto", p: "4", pt: "20" })}>
            <div className={css({ textAlign: "center", mb: "8" })}>
              <h1 className={css({ fontSize: "2xl", fontWeight: "bold", color: "gray.900", mb: "2" })}>
                Easybusy
              </h1>
              <p className={css({ color: "gray.600" })}>
                구글 캘린더를 연결하여 일정을 확인하세요
              </p>
            </div>
            <GoogleConnectButton connectedEmails={[]} onDisconnect={() => {}} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={css({ minH: "screen", bg: "gray.50", display: "flex", flexDirection: "column" })}>
      <div className={css({ flex: "1" })}>
        <div className={css({ maxW: "3xl", mx: "auto", p: "4" })}>
          {/* 헤더 */}
          <div className={flex({ justify: "space-between", align: "center", mb: "6" })}>
            <h1 className={css({ fontSize: "2xl", fontWeight: "bold", color: "gray.900" })}>
              Easybusy
            </h1>
            <button
              onClick={() => setShowCalendarSelector(!showCalendarSelector)}
              className={css({
                px: "3",
                py: "1.5",
                fontSize: "sm",
                color: "gray.600",
                borderRadius: "md",
                border: "1px solid",
                borderColor: "gray.300",
                cursor: "pointer",
                _hover: { bg: "gray.100" },
              })}
            >
              캘린더 설정
            </button>
          </div>

          {/* 에러 표시 */}
          {error && (
            <div className={css({ p: "4", mb: "4", bg: "red.50", color: "red.700", borderRadius: "lg" })}>
              {error}
            </div>
          )}

          {/* 캘린더 선택기 */}
          {showCalendarSelector && (
            <div className={css({ mb: "4", display: "flex", flexDirection: "column", gap: "4" })}>
              <CalendarSelector
                calendars={calendars}
                selectedIds={selectedCalendarIds}
                onToggle={toggleCalendar}
              />
              <GoogleConnectButton connectedEmails={connectedEmails} onDisconnect={() => {}} />
            </div>
          )}

          {/* 날짜 네비게이션 */}
          <div className={css({ mb: "4" })}>
            <DateNavigation
              date={selectedDate}
              onPrevDay={goToPrevDay}
              onNextDay={goToNextDay}
              onToday={goToToday}
            />
          </div>

          {/* 로딩 */}
          {loading && (
            <div className={css({ textAlign: "center", py: "8", color: "gray.500" })}>
              로딩 중...
            </div>
          )}

          {/* 타임라인 */}
          {!loading && (
            <div className={css({ bg: "white", borderRadius: "xl", boxShadow: "sm", p: "4" })}>
              {events.length === 0 ? (
                <div className={css({ textAlign: "center", py: "12", color: "gray.500" })}>
                  일정이 없습니다
                </div>
              ) : (
                <DailyTimeline events={events} onEventClick={setSelectedEvent} />
              )}
            </div>
          )}

          {/* 상세 모달 */}
          <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  );
}