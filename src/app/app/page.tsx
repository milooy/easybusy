"use client";

import { useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";
import { PageLayout } from "@/components/layout/PageLayout";

function Header({
  onToggleSettings,
  onSignOut,
}: {
  onToggleSettings?: () => void;
  onSignOut: () => void;
}) {
  return (
    <div
      className={flex({
        justify: "space-between",
        align: "center",
        mb: "6",
      })}
    >
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
          color: "gray.900",
        })}
      >
        Easybusy
      </h1>
      <div className={css({ display: "flex", gap: "2" })}>
        {onToggleSettings && (
          <button
            onClick={onToggleSettings}
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
        )}
        <button
          onClick={onSignOut}
          className={css({
            px: "3",
            py: "1.5",
            fontSize: "sm",
            color: "red.600",
            borderRadius: "md",
            border: "1px solid",
            borderColor: "red.300",
            cursor: "pointer",
            _hover: { bg: "red.50" },
          })}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

function LoadingState({ onSignOut }: { onSignOut: () => void }) {
  return (
    <>
      <Header onSignOut={onSignOut} />
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: "20",
        })}
      >
        <div className={css({ color: "gray.500" })}>로딩 중...</div>
      </div>
    </>
  );
}

function GoogleConnectState({ onSignOut }: { onSignOut: () => void }) {
  return (
    <>
      <Header onSignOut={onSignOut} />
      <div className={css({ textAlign: "center", mb: "8", pt: "8" })}>
        <p className={css({ color: "gray.600" })}>
          구글 캘린더를 연결하여 일정을 확인하세요
        </p>
      </div>
      <GoogleConnectButton connectedEmails={[]} onDisconnect={() => {}} />
    </>
  );
}

function AppContent() {
  const { signOut } = useAuth();
  const {
    calendars,
    selectedCalendarIds,
    events,
    selectedDate,
    loading,
    error,
    isConnected,
    connectedEmails,
    toggleCalendar,
    goToPrevDay,
    goToNextDay,
    goToToday,
  } = useGoogleCalendar();

  const [selectedEvent, setSelectedEvent] = useState<GoogleEvent | null>(null);
  const [showCalendarSelector, setShowCalendarSelector] = useState(false);

  const maxWidth = isConnected === null || !isConnected ? "md" : "3xl";

  return (
    <PageLayout maxWidth={maxWidth} showFooter={false}>
      {isConnected === null && <LoadingState onSignOut={signOut} />}

      {isConnected === false && <GoogleConnectState onSignOut={signOut} />}

      {isConnected && (
        <>
          <Header
            onToggleSettings={() => setShowCalendarSelector(!showCalendarSelector)}
            onSignOut={signOut}
          />

          {error && (
            <div
              className={css({
                p: "4",
                mb: "4",
                bg: "red.50",
                color: "red.700",
                borderRadius: "lg",
              })}
            >
              {error}
            </div>
          )}

          {showCalendarSelector && (
            <div
              className={css({
                mb: "4",
                display: "flex",
                flexDirection: "column",
                gap: "4",
              })}
            >
              <CalendarSelector
                calendars={calendars}
                selectedIds={selectedCalendarIds}
                onToggle={toggleCalendar}
              />
              <GoogleConnectButton
                connectedEmails={connectedEmails}
                onDisconnect={() => {}}
              />
            </div>
          )}

          <div className={css({ mb: "4" })}>
            <DateNavigation
              date={selectedDate}
              onPrevDay={goToPrevDay}
              onNextDay={goToNextDay}
              onToday={goToToday}
            />
          </div>

          {loading && (
            <div
              className={css({
                textAlign: "center",
                py: "8",
                color: "gray.500",
              })}
            >
              로딩 중...
            </div>
          )}

          {!loading && (
            <div
              className={css({
                bg: "white",
                borderRadius: "xl",
                boxShadow: "sm",
                p: "4",
              })}
            >
              {events.length === 0 ? (
                <div
                  className={css({
                    textAlign: "center",
                    py: "12",
                    color: "gray.500",
                  })}
                >
                  일정이 없습니다
                </div>
              ) : (
                <DailyTimeline events={events} onEventClick={setSelectedEvent} />
              )}
            </div>
          )}

          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        </>
      )}
    </PageLayout>
  );
}

export default function AppPage() {
  return (
    <AuthGuard>
      <AppContent />
    </AuthGuard>
  );
}
