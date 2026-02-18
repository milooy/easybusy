"use client";

import { GoogleEvent, getEventTimes } from "@/lib/google-calendar";
import { formatTime } from "@/lib/date-utils";
import { COLORS } from "@/lib/constants";
import { css } from "../../../../styled-system/css";
import { getEventPosition } from "./timelineUtils";

interface TimedEventBlockProps {
  event: GoogleEvent;
  timelineStartHour: number;
  onClick: (event: GoogleEvent) => void;
}

export const TimedEventBlock = ({ event, timelineStartHour, onClick }: TimedEventBlockProps) => {
  const position = getEventPosition(event, timelineStartHour);
  const { start, end } = getEventTimes(event);

  return (
    <button
      onClick={() => onClick(event)}
      className={css({
        position: "absolute",
        left: "4px",
        right: "4px",
        borderRadius: "md",
        px: "2",
        py: "1",
        overflow: "hidden",
        cursor: "pointer",
        transition: "opacity 0.2s",
        _hover: { opacity: 0.9 },
      })}
      style={{
        top: position.top,
        height: position.height,
        backgroundColor: event.calendarColor || COLORS.GOOGLE_CALENDAR_DEFAULT,
      }}
    >
      <div className={css({ fontSize: "xs", fontWeight: "medium", color: "white", truncate: true })}>
        {event.summary || "(제목 없음)"}
      </div>
      <div className={css({ fontSize: "xs", color: "white", opacity: 0.8 })}>
        {formatTime(start)} - {formatTime(end)}
      </div>
    </button>
  );
};
