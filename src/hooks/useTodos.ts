"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Todo } from "@/types/todo";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEYS.TODOS, []);

  const addTodo = useCallback(
    (
      title: string,
      options?: {
        description?: string;
        folderId?: string;
        assignedDate?: string;
        assignedHour?: number;
      }
    ) => {
      const newTodo: Todo = {
        id: generateId(),
        title,
        description: options?.description,
        createdTime: new Date().toISOString(),
        completed: false,
        folderId: options?.folderId ?? "none",
        assignedDate: options?.assignedDate,
        assignedHour: options?.assignedHour,
      };
      setTodos((prev) => [newTodo, ...prev]);
      return newTodo;
    },
    [setTodos]
  );

  const updateTodo = useCallback(
    (id: string, changes: Partial<Omit<Todo, "id" | "createdTime">>) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo))
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  return { todos, addTodo, updateTodo, deleteTodo, toggleTodo };
}
