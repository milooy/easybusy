"use client";

import { useState } from "react";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";
import { TODO_FOLDERS } from "@/types/todo";
import { useTodos } from "@/hooks/useTodos";
import { TodoItem } from "./TodoItem";
import { TodoAddForm } from "./TodoAddForm";

export function TodoInbox() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, togglePlan } = useTodos();
  const [activeFolderId, setActiveFolderId] = useState("none");

  const todayStr = new Date().toISOString().split("T")[0];
  const handleTogglePlan = (id: string) => togglePlan(id, todayStr);

  const filteredTodos = todos.filter((t) => t.folderId === activeFolderId);
  // 캘린더에 배정된 투두는 인박스에서 숨긴다
  const activeTodos = filteredTodos.filter((t) => !t.completed && !t.assignedDate);
  const completedTodos = filteredTodos.filter((t) => t.completed);

  return (
    <div
      className={css({
        w: "280px",
        flexShrink: 0,
        bg: "white",
        borderRadius: "xl",
        boxShadow: "sm",
        p: "4",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      })}
    >
      {/* 헤더 */}
      <h2 className={css({ fontSize: "md", fontWeight: "semibold", color: "gray.800", mb: "3" })}>
        투두
      </h2>

      {/* 폴더 탭 */}
      <div className={flex({ gap: "1", mb: "3" })}>
        {TODO_FOLDERS.map((folder) => {
          const count = todos.filter((t) => t.folderId === folder.id && !t.completed).length;
          const isActive = activeFolderId === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => setActiveFolderId(folder.id)}
              className={css({
                px: "3",
                py: "1",
                fontSize: "xs",
                borderRadius: "full",
                cursor: "pointer",
                fontWeight: isActive ? "semibold" : "normal",
                bg: isActive ? "blue.500" : "gray.100",
                color: isActive ? "white" : "gray.600",
                _hover: { bg: isActive ? "blue.600" : "gray.200" },
              })}
            >
              {folder.name}
              {count > 0 && (
                <span className={css({ ml: "1", opacity: 0.8 })}>({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 투두 목록 */}
      <div className={css({ flex: 1, overflowY: "auto", minH: "0" })}>
        {activeTodos.length === 0 && completedTodos.length === 0 && (
          <p className={css({ fontSize: "sm", color: "gray.400", textAlign: "center", py: "4" })}>
            할 일이 없습니다
          </p>
        )}

        {activeTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
            onTogglePlan={handleTogglePlan}
          />
        ))}

        {completedTodos.length > 0 && (
          <>
            <div
              className={css({
                fontSize: "xs",
                color: "gray.400",
                mt: "3",
                mb: "1",
                px: "2",
              })}
            >
              완료 ({completedTodos.length})
            </div>
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))}
          </>
        )}
      </div>

      {/* 추가 폼 */}
      <TodoAddForm onAdd={(title) => addTodo(title, { folderId: activeFolderId })} />
    </div>
  );
}
