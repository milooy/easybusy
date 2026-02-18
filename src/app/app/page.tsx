"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { AuthGuard } from "@/components/AuthGuard";
import { CalendarSection, DateNavigation, GoogleConnectButton } from "@/components/calendar";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { TodoInbox } from "@/components/todo/TodoInbox";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useTodos } from "@/hooks/useTodos";
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
  const { updateTodo } = useTodos();

  const maxWidth = isConnected === null || !isConnected ? "md" : "4xl";

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    if (!overId.startsWith("freeslot_")) return;

    // "freeslot_2025-01-15_14.5" → assignedDate, assignedHour
    const parts = overId.split("_");
    const assignedDate = parts[1];
    const assignedHour = parseFloat(parts[2]);

    updateTodo(active.id as string, { assignedDate, assignedHour });
  };

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

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className={flex({ align: "flex-start", gap: "4" })}>
              <CalendarSection
                events={events}
                selectedDate={selectedDate}
                loading={loading}
                error={error}
              />
              <TodoInbox />
            </div>
          </DndContext>
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
