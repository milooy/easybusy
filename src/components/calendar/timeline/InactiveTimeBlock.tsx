"use client";

import { css } from "../../../../styled-system/css";

interface InactiveTimeBlockProps {
  /** 비활성 블록 시작 시간 */
  startHour: number;
  /** 비활성 블록 종료 시간 */
  endHour: number;
  /** 타임라인 최상단 기준 시간 (항상 0) */
  timelineStartHour: number;
  /** 드래그 핸들 위치: "bottom" = startTime 핸들, "top" = endTime 핸들 */
  handlePosition: "bottom" | "top";
  /** 핸들 마우스다운 이벤트 */
  onHandleMouseDown: (e: React.MouseEvent) => void;
}

/**
 * startTime 이전 / endTime 이후의 비활성 시간대 블록.
 * - 어두운 배경으로 비활성 영역 표시
 * - 드래그 핸들로 startTime / endTime 조절 가능
 */
export const InactiveTimeBlock = ({
  startHour,
  endHour,
  timelineStartHour,
  handlePosition,
  onHandleMouseDown,
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
    >
      {/* 드래그 핸들 */}
      <div
        className={css({
          position: "absolute",
          left: 0,
          right: 0,
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "ns-resize",
          pointerEvents: "auto",
          _hover: {
            "& > div": {
              bg: "gray.400",
            },
          },
        })}
        style={handlePosition === "bottom" ? { bottom: 0 } : { top: 0 }}
        onMouseDown={onHandleMouseDown}
      >
        {/* 핸들 비주얼: 가로 줄 두 개 */}
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "1",
            alignItems: "center",
          })}
        >
          <div
            className={css({
              width: "24px",
              height: "2px",
              bg: "gray.300",
              borderRadius: "full",
            })}
          />
          <div
            className={css({
              width: "24px",
              height: "2px",
              bg: "gray.300",
              borderRadius: "full",
            })}
          />
        </div>
      </div>
    </div>
  );
};
