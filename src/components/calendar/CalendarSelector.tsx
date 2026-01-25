"use client";

import { GoogleCalendar } from "@/lib/google-calendar";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";

interface CalendarSelectorProps {
  calendars: GoogleCalendar[];
  selectedIds: string[];
  onToggle: (calendarId: string) => void;
}

export const CalendarSelector = ({ calendars, selectedIds, onToggle }: CalendarSelectorProps) => {
  if (calendars.length === 0) return null;

  return (
    <div className={css({ p: "4", bg: "gray.50", borderRadius: "lg" })}>
      <h3 className={css({ fontSize: "sm", fontWeight: "semibold", color: "gray.700", mb: "3" })}>
        캘린더 선택
      </h3>
      <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
        {calendars.map((calendar) => (
          <label
            key={calendar.id}
            className={flex({
              align: "center",
              gap: "2",
              cursor: "pointer",
              p: "2",
              borderRadius: "md",
              _hover: { bg: "gray.100" },
            })}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(calendar.id)}
              onChange={() => onToggle(calendar.id)}
              className={css({ cursor: "pointer" })}
            />
            <div
              className={css({ w: "3", h: "3", borderRadius: "sm", flexShrink: 0 })}
              style={{ backgroundColor: calendar.backgroundColor }}
            />
            <span className={css({ fontSize: "sm", color: "gray.700", truncate: true })}>
              {calendar.summary}
              {calendar.primary && (
                <span className={css({ color: "gray.400", ml: "1" })}>(기본)</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
