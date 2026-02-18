"use client";

import { GoogleEvent } from "@/lib/google-calendar";
import { COLORS } from "@/lib/constants";
import { css } from "../../../../styled-system/css";

interface AllDayEventsProps {
  events: GoogleEvent[];
  onEventClick: (event: GoogleEvent) => void;
}

export const AllDayEvents = ({ events, onEventClick }: AllDayEventsProps) => {
  if (events.length === 0) return null;

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "2",
        p: "4",
        bg: "gray.50",
        borderRadius: "lg",
      })}
    >
      <span className={css({ fontSize: "sm", fontWeight: "medium", color: "gray.600" })}>
        종일
      </span>
      <div className={css({ display: "flex", flexWrap: "wrap", gap: "2" })}>
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => onEventClick(event)}
            className={css({
              px: "3",
              py: "1.5",
              borderRadius: "md",
              fontSize: "sm",
              fontWeight: "medium",
              color: "white",
              cursor: "pointer",
              transition: "opacity 0.2s",
              _hover: { opacity: 0.8 },
            })}
            style={{ backgroundColor: event.calendarColor || COLORS.GOOGLE_CALENDAR_DEFAULT }}
          >
            {event.summary || "(제목 없음)"}
          </button>
        ))}
      </div>
    </div>
  );
};
