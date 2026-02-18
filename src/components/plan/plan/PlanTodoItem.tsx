"use client";

import { X } from "lucide-react";
import { css } from "../../../../styled-system/css";
import { flex } from "../../../../styled-system/patterns";
import type { Todo } from "@/types/todo";

interface PlanTodoItemProps {
  todo: Todo;
  onRemove: (id: string) => void;
}

export function PlanTodoItem({ todo, onRemove }: PlanTodoItemProps) {
  return (
    <div
      className={flex({
        align: "center",
        gap: "2",
        py: "1",
        px: "2",
        borderRadius: "md",
        bg: "yellow.50",
        _hover: { bg: "yellow.100" },
      })}
    >
      <span
        className={css({
          flex: 1,
          fontSize: "xs",
          color: "gray.700",
          wordBreak: "break-word",
        })}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onRemove(todo.id)}
        title="Plan에서 제거"
        className={css({
          p: "0.5",
          color: "gray.400",
          borderRadius: "sm",
          cursor: "pointer",
          flexShrink: 0,
          _hover: { color: "gray.600", bg: "gray.100" },
        })}
      >
        <X size={12} />
      </button>
    </div>
  );
}
