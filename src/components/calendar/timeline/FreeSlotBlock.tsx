"use client";

import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Check, GripVertical } from "lucide-react";
import { css } from "../../../../styled-system/css";
import { flex } from "../../../../styled-system/patterns";
import { BLOCK_MARGIN, formatHour } from "./timelineUtils";
import type { Todo } from "@/types/todo";

interface FreeSlotBlockProps {
  slotStart: number;
  slotEnd: number;
  timelineStartHour: number;
  selectedDate: string;
  assignedTodos: Todo[];
  onToggle: (id: string) => void;
}

export const FreeSlotBlock = ({
  slotStart,
  slotEnd,
  timelineStartHour,
  selectedDate,
  assignedTodos,
  onToggle,
}: FreeSlotBlockProps) => {
  const top = (slotStart - timelineStartHour) * 60 + BLOCK_MARGIN;
  const height = (slotEnd - slotStart) * 60 - BLOCK_MARGIN * 2;

  const droppableId = `freeslot_${selectedDate}_${slotStart}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <div
      ref={setNodeRef}
      className={css({
        position: "absolute",
        left: "4px",
        right: "4px",
        bg: isOver ? "yellow.100" : "yellow.50",
        borderRadius: "md",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 0,
        transition: "background-color 0.15s",
        border: isOver ? "1.5px dashed token(colors.yellow.400)" : "1.5px solid transparent",
      })}
      style={{ top: `${top}px`, height: `${height}px` }}
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
  );
};

function SlotTodoItem({ todo, onToggle }: { todo: Todo; onToggle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: todo.id });

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.3 : 1 }}
      className={flex({ align: "center", gap: "1.5", py: "0.5" })}
    >
      <button
        {...listeners}
        {...attributes}
        className={css({
          color: "yellow.400",
          cursor: "grab",
          flexShrink: 0,
          _hover: { color: "yellow.600" },
          _active: { cursor: "grabbing" },
        })}
      >
        <GripVertical size={12} />
      </button>
      <button
        onClick={() => onToggle(todo.id)}
        className={css({
          w: "4",
          h: "4",
          border: "1.5px solid",
          borderColor: todo.completed ? "blue.500" : "yellow.500",
          borderRadius: "sm",
          bg: todo.completed ? "blue.500" : "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: "pointer",
          _hover: { borderColor: "blue.400" },
        })}
      >
        {todo.completed && <Check size={10} color="white" strokeWidth={3} />}
      </button>
      <span
        className={css({
          fontSize: "xs",
          color: todo.completed ? "gray.400" : "gray.700",
          textDecoration: todo.completed ? "line-through" : "none",
          wordBreak: "break-word",
          lineHeight: "tight",
        })}
      >
        {todo.title}
      </span>
    </div>
  );
}
