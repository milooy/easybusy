"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Trash2, Pencil, Check, X, GripVertical, CalendarPlus } from "lucide-react";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onTogglePlan?: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete, onTogglePlan }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: todo.id,
    disabled: todo.completed,
  });

  const handleEditSubmit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    onUpdate(todo.id, { title: trimmed });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className={flex({
        align: "center",
        gap: "2",
        py: "2",
        px: "2",
        borderRadius: "md",
        _hover: { bg: "gray.50" },
      })}
    >
      {/* 드래그 핸들 */}
      {!todo.completed && (
        <button
          {...listeners}
          {...attributes}
          className={css({
            color: "gray.300",
            cursor: "grab",
            flexShrink: 0,
            _hover: { color: "gray.500" },
            _active: { cursor: "grabbing" },
          })}
        >
          <GripVertical size={14} />
        </button>
      )}
      {/* 체크박스 */}
      <button
        onClick={() => onToggle(todo.id)}
        className={css({
          w: "5",
          h: "5",
          border: "2px solid",
          borderColor: todo.completed ? "blue.500" : "gray.300",
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
        {todo.completed && <Check size={12} color="white" strokeWidth={3} />}
      </button>

      {/* 제목 (수정 모드 / 표시 모드) */}
      {isEditing ? (
        <div className={flex({ align: "center", gap: "1", flex: 1 })}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSubmit();
              if (e.key === "Escape") handleEditCancel();
            }}
            autoFocus
            className={css({
              flex: 1,
              px: "2",
              py: "1",
              fontSize: "sm",
              border: "1px solid",
              borderColor: "blue.400",
              borderRadius: "sm",
              outline: "none",
            })}
          />
          <button
            onClick={handleEditSubmit}
            className={css({ color: "blue.500", cursor: "pointer", p: "1" })}
          >
            <Check size={14} />
          </button>
          <button
            onClick={handleEditCancel}
            className={css({ color: "gray.400", cursor: "pointer", p: "1" })}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <span
          className={css({
            flex: 1,
            fontSize: "sm",
            color: todo.completed ? "gray.400" : "gray.800",
            textDecoration: todo.completed ? "line-through" : "none",
            wordBreak: "break-word",
          })}
        >
          {todo.title}
        </span>
      )}

      {/* 액션 버튼 (수정 모드가 아닐 때만) */}
      {!isEditing && (
        <div className={flex({ align: "center", gap: "1", flexShrink: 0 })}>
          {onTogglePlan && !todo.completed && (
            <button
              onClick={() => onTogglePlan(todo.id)}
              title={todo.plannedDate ? "Plan에서 제거" : "오늘 Plan에 추가"}
              className={css({
                p: "1",
                color: todo.plannedDate ? "blue.500" : "gray.400",
                borderRadius: "sm",
                cursor: "pointer",
                _hover: { color: "blue.600", bg: "blue.50" },
              })}
            >
              <CalendarPlus size={13} />
            </button>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className={css({
              p: "1",
              color: "gray.400",
              borderRadius: "sm",
              cursor: "pointer",
              _hover: { color: "gray.600", bg: "gray.100" },
            })}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className={css({
              p: "1",
              color: "gray.400",
              borderRadius: "sm",
              cursor: "pointer",
              _hover: { color: "red.500", bg: "red.50" },
            })}
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
