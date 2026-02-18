"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { GoogleEvent, getEventTimes } from "@/lib/google-calendar";
import { formatTime, isToday } from "@/lib/date-utils";
import { COLORS } from "@/lib/constants";
import { useUserSettings, OffTimeRange } from "@/hooks/useUserSettings";
import { css } from "../../../styled-system/css";

interface DailyTimelineProps {
  events: GoogleEvent[];
  onEventClick: (event: GoogleEvent) => void;
  selectedDate: Date;
}

const formatHour = (h: number) => {
  const hh = Math.floor(h).toString().padStart(2, "0");
  const mm = Math.round((h % 1) * 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

/**
 * startHour~endHour 범위에서 휴식 시간과 이벤트가 없는 빈 슬롯 계산
 */
const getFreeSlots = (
  startHour: number,
  endHour: number,
  offTimes: OffTimeRange[],
  timedEvents: GoogleEvent[]
): [number, number][] => {
  const occupied: [number, number][] = [
    ...offTimes.map((o) => [o.startHour, o.endHour] as [number, number]),
    ...timedEvents.map((event) => {
      const { start, end } = getEventTimes(event);
      const s = start.getHours() + start.getMinutes() / 60;
      const e = end.getHours() + end.getMinutes() / 60;
      return [s, e] as [number, number];
    }),
  ];

  const clipped = occupied
    .map(([s, e]) => [Math.max(s, startHour), Math.min(e, endHour)] as [number, number])
    .filter(([s, e]) => s < e);

  clipped.sort((a, b) => a[0] - b[0]);

  const merged: [number, number][] = [];
  for (const [s, e] of clipped) {
    if (merged.length === 0 || merged[merged.length - 1][1] < s) {
      merged.push([s, e]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    }
  }

  const freeSlots: [number, number][] = [];
  let current = startHour;
  for (const [s, e] of merged) {
    if (current < s) freeSlots.push([current, s]);
    current = Math.max(current, e);
  }
  if (current < endHour) freeSlots.push([current, endHour]);

  return freeSlots;
};

/**
 * 이벤트의 타임라인 위치 계산
 * @param startHourOffset 타임라인 시작 시간 (설정에 따른 오프셋)
 */
const BLOCK_MARGIN = 2;

const getEventPosition = (event: GoogleEvent, startHourOffset: number) => {
  const { start, end } = getEventTimes(event);
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  const duration = endHour - startHour;

  return {
    top: `${(startHour - startHourOffset) * 60 + BLOCK_MARGIN}px`,
    height: `${Math.max(duration * 60 - BLOCK_MARGIN * 2, 20)}px`,
  };
};

export const DailyTimeline = ({ events, onEventClick, selectedDate }: DailyTimelineProps) => {
  const { settings } = useUserSettings();
  const startHour = settings.dailyStartTime ?? 0;
  const endHour = settings.dailyEndTime ?? 24;

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

  const showCurrentTime = isToday(selectedDate);

  const [now, setNow] = useState(() => new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1분마다 현재 시간 갱신
  useEffect(() => {
    if (!showCurrentTime) return;

    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [showCurrentTime]);

  // 마운트 시 현재 시간 위치로 자동 스크롤
  useEffect(() => {
    if (!showCurrentTime || !scrollContainerRef.current) return;

    const currentHour = now.getHours() + now.getMinutes() / 60;
    const scrollTop = (currentHour - startHour) * 60 - 120;
    scrollContainerRef.current.scrollTop = Math.max(0, scrollTop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentTimeTop = useMemo(() => {
    const currentHour = now.getHours() + now.getMinutes() / 60;
    if (currentHour < startHour || currentHour > endHour) return null;
    return (currentHour - startHour) * 60;
  }, [now, startHour, endHour]);

  const currentTimeLabel = useMemo(() => {
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  }, [now]);

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
                style={{ backgroundColor: event.calendarColor || COLORS.GOOGLE_CALENDAR_DEFAULT }}
              >
                {event.summary || "(제목 없음)"}
              </button>
            ))}
          </div>
        </div>
      )}

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
          <div className={css({ flex: 1, position: "relative", borderLeft: "1px solid", borderColor: "gray.200" })}>
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

            {/* 빈 슬롯 블록 (연노랑) */}
            {freeSlots.map(([slotStart, slotEnd], index) => {
              const top = (slotStart - startHour) * 60 + BLOCK_MARGIN;
              const height = (slotEnd - slotStart) * 60 - BLOCK_MARGIN * 2;

              return (
                <div
                  key={`free-${index}`}
                  className={css({
                    position: "absolute",
                    left: "4px",
                    right: "4px",
                    bg: "yellow.50",
                    borderRadius: "md",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 0,
                  })}
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <span className={css({ fontSize: "xs", color: "yellow.700" })}>
                    {formatHour(slotStart)} - {formatHour(slotEnd)}
                  </span>
                </div>
              );
            })}

            {/* 휴식 블록 */}
            {settings.dailyOffTimes.map((offTime, index) => {
              const top = (offTime.startHour - startHour) * 60 + BLOCK_MARGIN;
              const height = (offTime.endHour - offTime.startHour) * 60 - BLOCK_MARGIN * 2;

              return (
                <div
                  key={`off-${index}`}
                  className={css({
                    position: "absolute",
                    left: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bg: "gray.100",
                    borderRadius: "sm",
                    zIndex: 0,
                  })}
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <span
                    className={css({
                      fontSize: "xs",
                      color: "gray.400",
                      fontWeight: "medium",
                    })}
                  >
                    휴식
                  </span>
                </div>
              );
            })}

            {/* 이벤트 블록 */}
            {timedEvents.map((event) => {
              const position = getEventPosition(event, startHour);
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
            })}

            {/* 현재 시간 인디케이터 */}
            {showCurrentTime && currentTimeTop !== null && (
              <div
                className={css({
                  position: "absolute",
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  pointerEvents: "none",
                })}
                style={{ top: `${currentTimeTop}px` }}
              >
                {/* 빨간 가로선 */}
                <div
                  className={css({
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: "2px",
                    bg: "red.500",
                  })}
                />
                {/* 원형 마커 */}
                <div
                  className={css({
                    position: "absolute",
                    left: "-4px",
                    top: "-3px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "full",
                    bg: "red.500",
                  })}
                />
              </div>
            )}
          </div>

          {/* 현재 시간 라벨 (시간 레이블 영역에 표시) */}
          {showCurrentTime && currentTimeTop !== null && (
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
