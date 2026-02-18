"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { CalendarSection, DateNavigation, GoogleConnectButton } from "@/components/calendar";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { TodoInbox } from "@/components/todo/TodoInbox";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";

export default function AppPage() {
  return (
    <AuthGuard>
      <AppContent />
    </AuthGuard>
  );
}

function AppContent() {
  const { signOut } = useAuth();
  const { events, selectedDate, loading, error, isConnected, goToPrevDay, goToNextDay, goToToday } =
    useGoogleCalendar();

  const maxWidth = isConnected === null || !isConnected ? "md" : "4xl";

  return (
    <PageLayout maxWidth={maxWidth} showFooter={false}>
      {isConnected === null && <LoadingState onSignOut={signOut} />}

      {isConnected === false && <GoogleConnectState onSignOut={signOut} />}

      {isConnected && (
        <>
          <AppHeader showSettings onSignOut={signOut} />

          <div className={css({ mb: "4" })}>
            <DateNavigation
              date={selectedDate}
              onPrevDay={goToPrevDay}
              onNextDay={goToNextDay}
              onToday={goToToday}
            />
          </div>

          <div className={flex({ align: "flex-start", gap: "4" })}>
            <CalendarSection
              events={events}
              selectedDate={selectedDate}
              loading={loading}
              error={error}
            />
            <TodoInbox />
          </div>
        </>
      )}
    </PageLayout>
  );
}

function LoadingState({ onSignOut }: { onSignOut: () => void }) {
  return (
    <>
      <AppHeader onSignOut={onSignOut} />
      <div className={css({ display: "flex", alignItems: "center", justifyContent: "center", py: "20" })}>
        <div className={css({ color: "gray.500" })}>로딩 중...</div>
      </div>
    </>
  );
}

function GoogleConnectState({ onSignOut }: { onSignOut: () => void }) {
  return (
    <>
      <AppHeader onSignOut={onSignOut} />
      <div className={css({ textAlign: "center", mb: "8", pt: "8" })}>
        <p className={css({ color: "gray.600" })}>구글 캘린더를 연결하여 일정을 확인하세요</p>
      </div>
      <GoogleConnectButton connectedEmails={[]} onDisconnect={() => {}} />
    </>
  );
}
