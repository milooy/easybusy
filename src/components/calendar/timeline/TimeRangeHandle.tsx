"use client";

import { ChevronsUpDown } from "lucide-react";
import { css } from "../../../../styled-system/css";

interface TimeRangeHandleProps {
  /** 타임라인 기준 top 위치 (px) */
  top: number;
  /** "업무 시작" | "업무 종료" */
  label: string;
  /** 현재 시간 (배지에 "09:00" 표시) */
  currentHour: number;
  /** 드래그 이벤트 */
  onMouseDown: (e: React.MouseEvent) => void;
}

const formatHour = (hour: number): string => {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

/**
 * 업무 시작/종료 시간을 나타내는 드래그 가능한 배지 컴포넌트.
 * 항상 표시되며, 드래그로 startTime/endTime 조절 가능.
 */
export const TimeRangeHandle = ({
  top,
  label,
  currentHour,
  onMouseDown,
}: TimeRangeHandleProps) => {
  return (
    <div
      className={css({
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
      })}
      style={{ top: `${top}px` }}
    >
      {/* 경계선 */}
      <div
        className={css({
          position: "absolute",
          left: 0,
          right: 0,
          height: "1px",
          bg: "gray.300",
        })}
      />

      {/* 배지 */}
      <div
        className={css({
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: "1",
          px: "2",
          py: "0.5",
          bg: "white",
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: "full",
          cursor: "ns-resize",
          pointerEvents: "auto",
          userSelect: "none",
          ml: "2",
          _hover: {
            bg: "gray.50",
            borderColor: "gray.400",
          },
        })}
        onMouseDown={onMouseDown}
      >
        <ChevronsUpDown size={12} className={css({ color: "gray.500", flexShrink: 0 })} />
        <span
          className={css({
            fontSize: "xs",
            color: "gray.600",
            whiteSpace: "nowrap",
          })}
        >
          {label}
        </span>
        <span
          className={css({
            fontSize: "xs",
            fontWeight: "bold",
            color: "gray.800",
            whiteSpace: "nowrap",
          })}
        >
          {formatHour(currentHour)}
        </span>
      </div>
    </div>
  );
};
