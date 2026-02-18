"use client";

import { useTodos } from "@/hooks/useTodos";
import { useUserSettings } from "@/hooks/useUserSettings";
import { getFreeSlots } from "@/components/calendar/timeline/timelineUtils";
import type { GoogleEvent } from "@/types/calendar";
import { getEventTimes } from "@/lib/google-calendar";

const SLOT_DURATION = 0.5; // 30분

export function usePlanArea(
  events: GoogleEvent[],
  _selectedDate: Date,
  todayStr: string
) {
  const { todos, updateTodo } = useTodos();
  const { settings } = useUserSettings();

  const endHour = settings.dailyEndTime ?? 24;
  const offTimes = settings.dailyOffTimes;

  // Plan 상태인 투두: plannedDate가 오늘이고, assignedDate가 없는 것
  const planTodos = todos.filter(
    (t) => t.plannedDate === todayStr && !t.assignedDate && !t.completed
  );

  // 오늘 날짜의 이벤트만 필터링
  const todayEvents = events.filter((event) => {
    const { start } = getEventTimes(event);
    return start.toISOString().split("T")[0] === todayStr;
  });

  // 현재 시각 (소수점 시간)
  const getCurrentHour = () => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  };

  // 오늘의 배정된 투두 슬롯 목록
  const getAssignedSlots = (): [number, number][] =>
    todos
      .filter((t) => t.assignedDate === todayStr && t.assignedHour !== undefined)
      .map((t) => [t.assignedHour!, t.assignedHour! + SLOT_DURATION] as [number, number]);

  // 빈 슬롯을 30분 단위로 분할하여 배정 가능한 시작 시각 목록 반환
  const getAvailableSlots = (fromHour: number): number[] => {
    const assignedSlots = getAssignedSlots();
    const syntheticOffTimes = [
      ...offTimes,
      ...assignedSlots.map(([s, e]) => ({ startHour: s, endHour: e })),
    ];
    const freeSlots = getFreeSlots(fromHour, endHour, syntheticOffTimes, todayEvents);

    const slots: number[] = [];
    for (const [slotStart, slotEnd] of freeSlots) {
      let s = slotStart;
      while (s + SLOT_DURATION <= slotEnd) {
        slots.push(s);
        s += SLOT_DURATION;
      }
    }
    return slots;
  };

  const handleAuto = () => {
    if (planTodos.length === 0) return;

    const currentHour = getCurrentHour();
    const fromHour = Math.ceil(currentHour / SLOT_DURATION) * SLOT_DURATION;
    const availableSlots = getAvailableSlots(fromHour);

    planTodos.forEach((todo, i) => {
      if (i >= availableSlots.length) return;
      updateTodo(todo.id, {
        assignedDate: todayStr,
        assignedHour: availableSlots[i],
        plannedDate: undefined,
      });
    });
  };

  const handlePush = () => {
    const currentHour = getCurrentHour();

    // 현재 시각 이전에 배정된 미완료 투두
    const overdueTodos = todos.filter(
      (t) =>
        t.assignedDate === todayStr &&
        t.assignedHour !== undefined &&
        !t.completed &&
        t.assignedHour < currentHour
    );

    if (overdueTodos.length === 0) return;

    const fromHour = Math.ceil(currentHour / SLOT_DURATION) * SLOT_DURATION;
    const availableSlots = getAvailableSlots(fromHour);

    overdueTodos.forEach((todo, i) => {
      if (i < availableSlots.length) {
        updateTodo(todo.id, { assignedHour: availableSlots[i] });
      } else {
        updateTodo(todo.id, {
          assignedDate: undefined,
          assignedHour: undefined,
          plannedDate: todayStr,
        });
      }
    });
  };

  return { planTodos, handleAuto, handlePush };
}
