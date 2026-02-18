"use client";

import { css } from "../../../../styled-system/css";

interface InactiveTimeBlockProps {
  /** 비활성 블록 시작 시간 */
  startHour: number;
  /** 비활성 블록 종료 시간 */
  endHour: number;
  /** 타임라인 최상단 기준 시간 (항상 0) */
  timelineStartHour: number;
}

/**
 * startTime 이전 / endTime 이후의 비활성 시간대 배경 블록.
 * 어두운 배경으로 비활성 영역만 표시 (드래그 핸들은 TimeRangeHandle 컴포넌트가 담당).
 */
export const InactiveTimeBlock = ({
  startHour,
  endHour,
  timelineStartHour,
}: InactiveTimeBlockProps) => {
  const top = (startHour - timelineStartHour) * 60;
  const height = (endHour - startHour) * 60;

  if (height <= 0) return null;

  return (
    <div
      className={css({
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 1,
        bg: "gray.50",
        borderRadius: "sm",
        pointerEvents: "none",
      })}
      style={{ top: `${top}px`, height: `${height}px` }}
    />
  );
};
