"use client";

import { useMemo } from "react";
import { GoogleEvent } from "@/lib/google-calendar";
import { isToday, toDateString } from "@/lib/date-utils";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useTodos } from "@/hooks/useTodos";
import { css } from "../../../styled-system/css";
import { getFreeSlots } from "./timeline/timelineUtils";
import { useCurrentTime } from "./timeline/useCurrentTime";
import { AllDayEvents } from "./timeline/AllDayEvents";
import { FreeSlotBlock } from "./timeline/FreeSlotBlock";
import { OffTimeBlock } from "./timeline/OffTimeBlock";
import { TimedEventBlock } from "./timeline/TimedEventBlock";
import { CurrentTimeIndicator } from "./timeline/CurrentTimeIndicator";

interface DailyTimelineProps {
  events: GoogleEvent[];
  onEventClick: (event: GoogleEvent) => void;
  selectedDate: Date;
}

export const DailyTimeline = ({ events, onEventClick, selectedDate }: DailyTimelineProps) => {
  const { settings } = useUserSettings();
  const { todos, toggleTodo } = useTodos();
  const startHour = settings.dailyStartTime ?? 0;
  const endHour = settings.dailyEndTime ?? 24;
  const selectedDateStr = toDateString(selectedDate);

  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    [startHour, endHour]
  );

  const allDayEvents = events.filter((e) => !e.start.dateTime);
  const timedEvents = events.filter((e) => e.start.dateTime);

  const freeSlots = useMemo(
    () => getFreeSlots(startHour, endHour, settings.dailyOffTimes, timedEvents),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startHour, endHour, settings.dailyOffTimes, events]
  );

  // 슬롯마다 인라인 filter를 반복하지 않도록 시작 시각(assignedHour) → 투두 목록으로 사전 그룹화
  const todosBySlotStart = useMemo(() => {
    const map = new Map<number, typeof todos>();
    todos.forEach((t) => {
      if (t.assignedDate === selectedDateStr && t.assignedHour !== undefined) {
        const list = map.get(t.assignedHour) ?? [];
        map.set(t.assignedHour, [...list, t]);
      }
    });
    return map;
  }, [todos, selectedDateStr]);

  const isActive = isToday(selectedDate);
  const { scrollContainerRef, currentTimeTop, currentTimeLabel } = useCurrentTime(
    startHour,
    endHour,
    isActive
  );

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
      <AllDayEvents events={allDayEvents} onEventClick={onEventClick} />

      {/* 시간대별 타임라인 */}
      <div
        ref={scrollContainerRef}
        className={css({ maxHeight: "calc(100vh - 220px)", overflowY: "auto" })}
      >
        <div className={css({ position: "relative", display: "flex" })}>
          {/* 시간 레이블 */}
          <div className={css({ width: "60px", flexShrink: 0 })}>
            {hours.map((hour) => (
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
          <div
            className={css({
              flex: 1,
              position: "relative",
              borderLeft: "1px solid",
              borderColor: "gray.200",
            })}
          >
            {/* 시간 그리드 라인 */}
            {hours.map((hour) => (
              <div
                key={hour}
                className={css({
                  height: "60px",
                  borderBottom: "1px solid",
                  borderColor: "gray.100",
                })}
              />
            ))}

            {freeSlots.map(([slotStart, slotEnd], index) => (
              <FreeSlotBlock
                key={`free-${index}`}
                slotStart={slotStart}
                slotEnd={slotEnd}
                timelineStartHour={startHour}
                selectedDate={selectedDateStr}
                assignedTodos={todosBySlotStart.get(slotStart) ?? []}
                onToggle={toggleTodo}
              />
            ))}

            {settings.dailyOffTimes.map((offTime, index) => (
              <OffTimeBlock
                key={`off-${index}`}
                offTime={offTime}
                timelineStartHour={startHour}
              />
            ))}

            {timedEvents.map((event) => (
              <TimedEventBlock
                key={event.id}
                event={event}
                timelineStartHour={startHour}
                onClick={onEventClick}
              />
            ))}

            {isActive && currentTimeTop !== null && (
              <CurrentTimeIndicator top={currentTimeTop} />
            )}
          </div>

          {/* 현재 시간 라벨 (시간 레이블 영역에 표시) */}
          {isActive && currentTimeTop !== null && (
            <div
              className={css({
                position: "absolute",
                left: 0,
                width: "56px",
                textAlign: "right",
                fontSize: "xs",
                fontWeight: "bold",
                color: "red.500",
                pointerEvents: "none",
                zIndex: 10,
              })}
              style={{ top: `${currentTimeTop - 8}px` }}
            >
              {currentTimeLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
