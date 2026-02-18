"use client";

import { useDraggable } from "@dnd-kit/core";
import { Check, GripVertical } from "lucide-react";
import { css } from "../../../../../styled-system/css";
import { flex } from "../../../../../styled-system/patterns";
import type { Todo } from "@/types/todo";

interface SlotTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

export function SlotTodoItem({ todo, onToggle }: SlotTodoItemProps) {
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
