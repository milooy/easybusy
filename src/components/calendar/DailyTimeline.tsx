"use client";

import { GoogleEvent, getEventTimes } from "@/lib/google-calendar";
import { css } from "../../../styled-system/css";

interface DailyTimelineProps {
  events: GoogleEvent[];
  onEventClick: (event: GoogleEvent) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const DailyTimeline = ({ events, onEventClick }: DailyTimelineProps) => {
  const allDayEvents = events.filter((e) => !e.start.dateTime);
  const timedEvents = events.filter((e) => e.start.dateTime);

  const getEventPosition = (event: GoogleEvent) => {
    const { start, end } = getEventTimes(event);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const duration = endHour - startHour;

    return {
      top: `${startHour * 60}px`,
      height: `${Math.max(duration * 60, 24)}px`,
    };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
      {/* 종일 일정 */}
      {allDayEvents.length > 0 && (
        <div className={css({ display: "flex", flexDirection: "column", gap: "2", p: "4", bg: "gray.50", borderRadius: "lg" })}>
          <span className={css({ fontSize: "sm", fontWeight: "medium", color: "gray.600" })}>종일</span>
          <div className={css({ display: "flex", flexWrap: "wrap", gap: "2" })}>
            {allDayEvents.map((event) => (
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
                style={{ backgroundColor: event.calendarColor || "#4285f4" }}
              >
                {event.summary || "(제목 없음)"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 시간대별 타임라인 */}
      <div className={css({ position: "relative", display: "flex" })}>
        {/* 시간 레이블 */}
        <div className={css({ width: "60px", flexShrink: 0 })}>
          {HOURS.map((hour) => (
            <div
              key={hour}
              className={css({
                height: "60px",
                fontSize: "xs",
                color: "gray.500",
                textAlign: "right",
                pr: "2",
                pt: "0.5",
              })}
            >
              {hour.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* 그리드 라인 + 이벤트 */}
        <div className={css({ flex: 1, position: "relative", borderLeft: "1px solid", borderColor: "gray.200" })}>
          {/* 시간 그리드 라인 */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className={css({
                height: "60px",
                borderBottom: "1px solid",
                borderColor: "gray.100",
              })}
            />
          ))}

          {/* 이벤트 블록 */}
          {timedEvents.map((event) => {
            const position = getEventPosition(event);
            const { start, end } = getEventTimes(event);

            return (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
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
                  backgroundColor: event.calendarColor || "#4285f4",
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
          })}
        </div>
      </div>
    </div>
  );
};
