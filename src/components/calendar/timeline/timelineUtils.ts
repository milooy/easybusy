import { GoogleEvent, getEventTimes } from "@/lib/google-calendar";
import { OffTimeRange } from "@/hooks/useUserSettings";

export const BLOCK_MARGIN = 2;

export const formatHour = (h: number) => {
  const hh = Math.floor(h).toString().padStart(2, "0");
  const mm = Math.round((h % 1) * 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

/**
 * startHour~endHour 범위에서 휴식 시간과 이벤트가 없는 빈 슬롯 계산
 */
export const getFreeSlots = (
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
export const getEventPosition = (event: GoogleEvent, startHourOffset: number) => {
  const { start, end } = getEventTimes(event);
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  const duration = endHour - startHour;

  return {
    top: `${(startHour - startHourOffset) * 60 + BLOCK_MARGIN}px`,
    height: `${Math.max(duration * 60 - BLOCK_MARGIN * 2, 20)}px`,
  };
};
