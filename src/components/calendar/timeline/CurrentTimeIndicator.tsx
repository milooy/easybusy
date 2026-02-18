"use client";

import { forwardRef } from "react";
import { css } from "../../../../styled-system/css";

interface CurrentTimeIndicatorProps {
  top: number;
}

export const CurrentTimeIndicator = forwardRef<HTMLDivElement, CurrentTimeIndicatorProps>(
  ({ top }, ref) => {
    return (
      <div
        ref={ref}
        className={css({
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: "none",
        })}
        style={{ top: `${top}px` }}
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
    );
  }
);

CurrentTimeIndicator.displayName = "CurrentTimeIndicator";
