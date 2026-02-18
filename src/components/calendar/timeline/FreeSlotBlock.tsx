"use client";

import { useState, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { css } from "../../../../styled-system/css";
import { flex } from "../../../../styled-system/patterns";
import { BLOCK_MARGIN, formatHour } from "./timelineUtils";
import { SlotTodoItem } from "./freeSlotBlock/SlotTodoItem";
import { SlotTodoInput } from "./freeSlotBlock/SlotTodoInput";
import type { Todo } from "@/types/todo";

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
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const top = (slotStart - timelineStartHour) * 60 + BLOCK_MARGIN;
  const height = (slotEnd - slotStart) * 60 - BLOCK_MARGIN * 2;
  const showInput = isHovered || isInputFocused;

  const handleMouseEnter = () => {
    clearTimeout(leaveTimerRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => setIsHovered(false), 150);
  };

  const droppableId = `freeslot_${selectedDate}_${slotStart}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={css({
        position: "absolute",
        left: "4px",
        right: "4px",
        zIndex: showInput ? 10 : 0,
      })}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      {/* 슬롯 본문 */}
      <div
        className={css({
          height: "100%",
          bg: isOver ? "yellow.100" : "yellow.50",
          borderRadius: "md",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "background-color 0.15s",
          border: isOver ? "1.5px dashed token(colors.yellow.400)" : "1.5px solid transparent",
        })}
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

      {/* 슬롯 외부 하단 - hover/focus 시에만 표시 */}
      {showInput && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={css({
            position: "absolute",
            left: 0,
            right: 0,
            top: "100%",
            bg: "white",
            borderRadius: "md",
            boxShadow: "sm",
            border: "1px solid",
            borderColor: "yellow.200",
            mt: "1",
          })}
        >
          <SlotTodoInput
            onAdd={onAddTodo}
            onFocusChange={setIsInputFocused}
          />
        </div>
      )}
    </div>
  );
};
