"use client";

import { OffTimeRange } from "@/hooks/useUserSettings";
import { css } from "../../../../styled-system/css";
import { BLOCK_MARGIN } from "./timelineUtils";

interface OffTimeBlockProps {
  offTime: OffTimeRange;
  timelineStartHour: number;
}

export const OffTimeBlock = ({ offTime, timelineStartHour }: OffTimeBlockProps) => {
  const top = (offTime.startHour - timelineStartHour) * 60 + BLOCK_MARGIN;
  const height = (offTime.endHour - offTime.startHour) * 60 - BLOCK_MARGIN * 2;

  return (
    <div
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
      <span className={css({ fontSize: "xs", color: "gray.400", fontWeight: "medium" })}>
        휴식
      </span>
    </div>
  );
};
