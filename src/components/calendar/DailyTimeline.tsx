"use client";

import { useMemo, useRef, useCallback } from "react";
import { GoogleEvent } from "@/lib/google-calendar";
import { isToday, toDateString } from "@/lib/date-utils";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useDailyTimeOverrides } from "@/hooks/useDailyTimeOverrides";
import { useTodos } from "@/hooks/useTodos";
import { css } from "../../../styled-system/css";
import { getFreeSlots } from "./timeline/timelineUtils";
import { useCurrentTime } from "./timeline/useCurrentTime";
import { useTimeRangeResize } from "./timeline/useTimeRangeResize";
import { AllDayEvents } from "./timeline/AllDayEvents";
import { FreeSlotBlock } from "./timeline/FreeSlotBlock";
import { OffTimeBlock } from "./timeline/OffTimeBlock";
import { TimedEventBlock } from "./timeline/TimedEventBlock";
import { CurrentTimeIndicator } from "./timeline/CurrentTimeIndicator";
import { InactiveTimeBlock } from "./timeline/InactiveTimeBlock";
import { TimeRangeHandle } from "./timeline/TimeRangeHandle";

const TIMELINE_START = 0;
const TIMELINE_END = 24;
const ALL_HOURS = Array.from({ length: TIMELINE_END - TIMELINE_START }, (_, i) => i);

interface DailyTimelineProps {
  events: GoogleEvent[];
  onEventClick: (event: GoogleEvent) => void;
  selectedDate: Date;
}

export const DailyTimeline = ({ events, onEventClick, selectedDate }: DailyTimelineProps) => {
  const { settings } = useUserSettings();
  const { getOverride, setOverride } = useDailyTimeOverrides();
  const { todos, toggleTodo, addTodo } = useTodos();
  const selectedDateStr = toDateString(selectedDate);

  // 전역 기본값 (settings)에 날짜별 override를 적용한 실제 시작/종료 시간
  const override = getOverride(selectedDateStr);
  const startHour = override?.startTime ?? settings.dailyStartTime ?? 0;
  const endHour = override?.endTime ?? settings.dailyEndTime ?? 24;

  const allDayEvents = events.filter((e) => !e.start.dateTime);
  const timedEvents = events.filter((e) => e.start.dateTime);

  const freeSlots = useMemo(
    () => getFreeSlots(startHour, endHour, settings.dailyOffTimes, timedEvents),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startHour, endHour, settings.dailyOffTimes, events]
  );

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
    TIMELINE_START,
    TIMELINE_END,
    isActive
  );

  // 그리드 영역 ref (드래그 좌표 계산 기준)
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const handleStartHourChange = useCallback(
    (hour: number) => setOverride(selectedDateStr, { startTime: hour }),
    [setOverride, selectedDateStr]
  );
  const handleEndHourChange = useCallback(
    (hour: number) => setOverride(selectedDateStr, { endTime: hour }),
    [setOverride, selectedDateStr]
  );

  const { startHandleProps, endHandleProps } = useTimeRangeResize({
    currentStartHour: startHour,
    currentEndHour: endHour,
    onStartHourChange: handleStartHourChange,
    onEndHourChange: handleEndHourChange,
    gridContainerRef,
  });

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
      <AllDayEvents events={allDayEvents} onEventClick={onEventClick} />

      {/* 시간대별 타임라인 */}
      <div
        ref={scrollContainerRef}
        className={css({ maxHeight: "calc(100vh - 220px)", overflowY: "auto" })}
      >
        <div className={css({ position: "relative", display: "flex" })}>
          {/* 시간 레이블 (0~24 전체) */}
          <div className={css({ width: "60px", flexShrink: 0 })}>
            {ALL_HOURS.map((hour) => (
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

          {/* 그리드 라인 + 이벤트 (0~24 전체) */}
          <div
            ref={gridContainerRef}
            className={css({
              flex: 1,
              position: "relative",
              borderLeft: "1px solid",
              borderColor: "gray.200",
            })}
          >
            {/* 시간 그리드 라인 */}
            {ALL_HOURS.map((hour) => (
              <div
                key={hour}
                className={css({
                  height: "60px",
                  borderBottom: "1px solid",
                  borderColor: "gray.100",
                })}
              />
            ))}

            {/* startTime 이전 비활성 영역 배경 */}
            {startHour > TIMELINE_START && (
              <InactiveTimeBlock
                startHour={TIMELINE_START}
                endHour={startHour}
                timelineStartHour={TIMELINE_START}
              />
            )}

            {/* endTime 이후 비활성 영역 배경 */}
            {endHour < TIMELINE_END && (
              <InactiveTimeBlock
                startHour={endHour}
                endHour={TIMELINE_END}
                timelineStartHour={TIMELINE_START}
              />
            )}

            {/* 업무 시작 배지 - 항상 표시 */}
            <TimeRangeHandle
              top={startHour * 60}
              label="업무 시작"
              currentHour={startHour}
              onMouseDown={startHandleProps.onMouseDown}
            />

            {/* 업무 종료 배지 - 항상 표시 */}
            <TimeRangeHandle
              top={endHour * 60}
              label="업무 종료"
              currentHour={endHour}
              onMouseDown={endHandleProps.onMouseDown}
            />

            {/* 활성 시간대 자유 슬롯 */}
            {freeSlots.map(([slotStart, slotEnd], index) => (
              <FreeSlotBlock
                key={`free-${index}`}
                slotStart={slotStart}
                slotEnd={slotEnd}
                timelineStartHour={TIMELINE_START}
                selectedDate={selectedDateStr}
                assignedTodos={todosBySlotStart.get(slotStart) ?? []}
                onToggle={toggleTodo}
                onAddTodo={(title) =>
                  addTodo(title, {
                    assignedDate: selectedDateStr,
                    assignedHour: slotStart,
                  })
                }
              />
            ))}

            {/* 휴식 시간 블록 */}
            {settings.dailyOffTimes.map((offTime, index) => (
              <OffTimeBlock
                key={`off-${index}`}
                offTime={offTime}
                timelineStartHour={TIMELINE_START}
              />
            ))}

            {/* 구글 캘린더 이벤트 (전체 24시간 범위) */}
            {timedEvents.map((event) => (
              <TimedEventBlock
                key={event.id}
                event={event}
                timelineStartHour={TIMELINE_START}
                onClick={onEventClick}
              />
            ))}

            {isActive && currentTimeTop !== null && (
              <CurrentTimeIndicator top={currentTimeTop} />
            )}
          </div>

          {/* 현재 시간 라벨 */}
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
