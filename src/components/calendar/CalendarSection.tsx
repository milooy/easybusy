"use client";

import { useState } from "react";
import { css } from "../../../styled-system/css";
import { DailyTimeline } from "./DailyTimeline";
import { EventDetailModal } from "./EventDetailModal";
import type { GoogleEvent } from "@/types/calendar";

interface CalendarSectionProps {
  events: GoogleEvent[];
  selectedDate: Date;
  loading: boolean;
  error: string | null;
}

export function CalendarSection({
  events,
  selectedDate,
  loading,
  error,
}: CalendarSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<GoogleEvent | null>(null);

  return (
    <div className={css({ flex: 1, minW: 0 })}>
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

      {loading ? (
        <div
          className={css({
            textAlign: "center",
            py: "8",
            color: "gray.500",
          })}
        >
          로딩 중...
        </div>
      ) : (
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
            <DailyTimeline
              events={events}
              onEventClick={setSelectedEvent}
              selectedDate={selectedDate}
            />
          )}
        </div>
      )}

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
