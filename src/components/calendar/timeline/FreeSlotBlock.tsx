"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { css } from "../../../../styled-system/css";
import { flex } from "../../../../styled-system/patterns";
import { BLOCK_MARGIN, formatHour } from "./timelineUtils";
import { SlotTodoItem } from "./freeSlotBlock/SlotTodoItem";
import { SlotTodoInput } from "./freeSlotBlock/SlotTodoInput";
import type { Todo } from "@/types/todo";

const INPUT_HEIGHT = 36;

interface FreeSlotBlockProps {
  slotStart: number;
  slotEnd: number;
  timelineStartHour: number;
  selectedDate: string;
  assignedTodos: Todo[];
  onToggle: (id: string) => void;
  onAddTodo: (title: string) => void;
}

export const FreeSlotBlock = ({
  slotStart,
  slotEnd,
  timelineStartHour,
  selectedDate,
  assignedTodos,
  onToggle,
  onAddTodo,
}: FreeSlotBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const top = (slotStart - timelineStartHour) * 60 + BLOCK_MARGIN;
  const height = (slotEnd - slotStart) * 60 - BLOCK_MARGIN * 2;
  const showInput = isHovered || isInputFocused;

  const droppableId = `freeslot_${selectedDate}_${slotStart}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={css({
        position: "absolute",
        left: "4px",
        right: "4px",
        bg: isOver ? "yellow.100" : "yellow.50",
        borderRadius: "md",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: showInput ? 10 : 0,
        transition: "background-color 0.15s, height 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        border: isOver ? "1.5px dashed token(colors.yellow.400)" : "1.5px solid transparent",
      })}
      style={{
        top: `${top}px`,
        height: `${showInput ? height + INPUT_HEIGHT : height}px`,
      }}
    >
      {/* 슬롯 본문 - 고정 높이 유지 */}
      <div
        className={css({
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        })}
        style={{ height: `${height}px` }}
      >
        {/* 슬롯 시간 레이블 */}
        <div
          className={flex({
            align: "center",
            justify: "center",
            px: "2",
            pt: "1",
            flexShrink: 0,
          })}
        >
          <span className={css({ fontSize: "xs", color: "yellow.700" })}>
            {formatHour(slotStart)} - {formatHour(slotEnd)}
          </span>
        </div>

        {/* 배정된 투두 목록 */}
        {assignedTodos.length > 0 && (
          <div className={css({ px: "2", pb: "1", overflowY: "auto", flex: 1 })}>
            {assignedTodos.map((todo) => (
              <SlotTodoItem key={todo.id} todo={todo} onToggle={onToggle} />
            ))}
          </div>
        )}
      </div>

      {/* 슬롯 하단 확장 영역 - overflow:hidden에 의해 height 애니메이션으로 나타남 */}
      <SlotTodoInput onAdd={onAddTodo} onFocusChange={setIsInputFocused} />
    </div>
  );
};
