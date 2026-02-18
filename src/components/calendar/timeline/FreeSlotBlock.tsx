"use client";

import { css } from "../../../../styled-system/css";
import { BLOCK_MARGIN, formatHour } from "./timelineUtils";

interface FreeSlotBlockProps {
  slotStart: number;
  slotEnd: number;
  timelineStartHour: number;
}

export const FreeSlotBlock = ({ slotStart, slotEnd, timelineStartHour }: FreeSlotBlockProps) => {
  const top = (slotStart - timelineStartHour) * 60 + BLOCK_MARGIN;
  const height = (slotEnd - slotStart) * 60 - BLOCK_MARGIN * 2;

  return (
    <div
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
};
