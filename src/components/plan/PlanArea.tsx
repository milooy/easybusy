"use client";

import { Zap, ArrowDown } from "lucide-react";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";
import type { GoogleEvent } from "@/types/calendar";
import { useTodos } from "@/hooks/useTodos";
import { usePlanArea } from "./plan/usePlanArea";
import { PlanTodoItem } from "./plan/PlanTodoItem";

interface PlanAreaProps {
  events: GoogleEvent[];
  selectedDate: Date;
}

export function PlanArea({ events, selectedDate }: PlanAreaProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const { updateTodo } = useTodos();
  const { planTodos, handleAuto, handlePush } = usePlanArea(events, selectedDate, todayStr);

  const handleRemove = (id: string) => {
    updateTodo(id, { plannedDate: undefined });
  };

  return (
    <div
      className={css({
        mt: "2",
        bg: "white",
        borderRadius: "xl",
        boxShadow: "sm",
        p: "3",
      })}
    >
      {/* 헤더 */}
      <div className={flex({ align: "center", justify: "space-between", mb: "2" })}>
        <h3
          className={css({
            fontSize: "sm",
            fontWeight: "semibold",
            color: "gray.700",
          })}
        >
          Plan
        </h3>
        <div className={flex({ align: "center", gap: "1" })}>
          <button
            onClick={handleAuto}
            disabled={planTodos.length === 0}
            title="현재 이후 빈 슬롯에 자동 배치"
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "1",
              px: "2",
              py: "1",
              fontSize: "xs",
              fontWeight: "medium",
              borderRadius: "md",
              cursor: "pointer",
              bg: "yellow.400",
              color: "white",
              _hover: { bg: "yellow.500" },
              _disabled: { opacity: 0.4, cursor: "not-allowed" },
            })}
          >
            <Zap size={12} />
            Auto
          </button>
          <button
            onClick={handlePush}
            title="완료 못 한 투두를 다음 슬롯으로 밀기"
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "1",
              px: "2",
              py: "1",
              fontSize: "xs",
              fontWeight: "medium",
              borderRadius: "md",
              cursor: "pointer",
              bg: "gray.200",
              color: "gray.700",
              _hover: { bg: "gray.300" },
            })}
          >
            <ArrowDown size={12} />
            Push
          </button>
        </div>
      </div>

      {/* Plan 투두 목록 */}
      {planTodos.length === 0 ? (
        <p
          className={css({
            fontSize: "xs",
            color: "gray.400",
            textAlign: "center",
            py: "2",
          })}
        >
          투두 목록에서 <strong>Today</strong> 버튼으로 추가하세요
        </p>
      ) : (
        <div className={flex({ direction: "column", gap: "1" })}>
          {planTodos.map((todo) => (
            <PlanTodoItem key={todo.id} todo={todo} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
