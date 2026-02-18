import { useCallback, useRef } from "react";

const HOUR_PX = 60; // 1시간 = 60px
const MIN_START_HOUR = 0;
const MAX_END_HOUR = 24;
const MIN_RANGE_HOURS = 1; // startTime과 endTime 최소 간격

interface UseTimeRangeResizeOptions {
  currentStartHour: number;
  currentEndHour: number;
  onStartHourChange: (hour: number) => void;
  onEndHourChange: (hour: number) => void;
  /** 드래그 기준이 되는 그리드 컨테이너 ref */
  gridContainerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 타임라인의 startTime / endTime을 마우스 드래그로 조절하는 훅.
 *
 * 반환값:
 * - startHandleProps: startTime 핸들에 spread할 이벤트 핸들러
 * - endHandleProps:   endTime 핸들에 spread할 이벤트 핸들러
 */
export function useTimeRangeResize({
  currentStartHour,
  currentEndHour,
  onStartHourChange,
  onEndHourChange,
  gridContainerRef,
}: UseTimeRangeResizeOptions) {
  const dragRef = useRef<{
    type: "start" | "end";
    startY: number;
    startHour: number;
  } | null>(null);

  /** 마우스 Y 좌표 → 1시간 단위 snap된 시간 */
  const yToHour = useCallback(
    (clientY: number): number => {
      const container = gridContainerRef.current;
      if (!container) return 0;

      const rect = container.getBoundingClientRect();
      const relativeY = clientY - rect.top + container.scrollTop;
      const rawHour = relativeY / HOUR_PX;
      return Math.round(rawHour); // 1시간 단위 snap
    },
    [gridContainerRef]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { type } = dragRef.current;
      const hour = yToHour(e.clientY);

      if (type === "start") {
        const clamped = Math.min(
          Math.max(hour, MIN_START_HOUR),
          currentEndHour - MIN_RANGE_HOURS
        );
        onStartHourChange(clamped);
      } else {
        const clamped = Math.max(
          Math.min(hour, MAX_END_HOUR),
          currentStartHour + MIN_RANGE_HOURS
        );
        onEndHourChange(clamped);
      }
    },
    [yToHour, currentStartHour, currentEndHour, onStartHourChange, onEndHourChange]
  );

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [handleMouseMove]);

  const startDrag = useCallback(
    (type: "start" | "end", e: React.MouseEvent) => {
      e.preventDefault();
      dragRef.current = {
        type,
        startY: e.clientY,
        startHour: type === "start" ? currentStartHour : currentEndHour,
      };
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [currentStartHour, currentEndHour, handleMouseMove, handleMouseUp]
  );

  return {
    startHandleProps: {
      onMouseDown: (e: React.MouseEvent) => startDrag("start", e),
    },
    endHandleProps: {
      onMouseDown: (e: React.MouseEvent) => startDrag("end", e),
    },
  };
}
