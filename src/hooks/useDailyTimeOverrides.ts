"use client";

import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";

/**
 * 날짜별 시작/종료 시간 오버라이드
 *
 * 미래 Supabase 스키마:
 * CREATE TABLE daily_time_overrides (
 *   id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id    uuid REFERENCES auth.users(id),
 *   date       date NOT NULL,
 *   start_time integer,   -- nullable: null이면 전역 기본값 사용
 *   end_time   integer,   -- nullable: null이면 전역 기본값 사용
 *   UNIQUE(user_id, date)
 * );
 */
export interface DailyTimeOverride {
  /** 날짜 (YYYY-MM-DD) */
  date: string;
  /** 시작 시간 (0~23), null이면 전역 기본값 사용 */
  startTime: number | null;
  /** 종료 시간 (1~24), null이면 전역 기본값 사용 */
  endTime: number | null;
}

/** localStorage 저장 형태 (date를 key로 사용) */
type DailyTimeOverridesStore = Record<string, Omit<DailyTimeOverride, "date">>;

/**
 * 날짜별 시작/종료 시간 오버라이드를 관리하는 훅
 *
 * 현재는 localStorage에 저장하며, 추후 Supabase로 마이그레이션 예정.
 * 마이그레이션 시 이 훅의 내부 구현만 교체하면 됨 (인터페이스 동일).
 */
export function useDailyTimeOverrides() {
  const [store, setStore] = useLocalStorage<DailyTimeOverridesStore>(
    STORAGE_KEYS.DAILY_TIME_OVERRIDES,
    {}
  );

  /** 특정 날짜의 오버라이드 조회 */
  function getOverride(date: string): DailyTimeOverride | null {
    const entry = store[date];
    if (!entry) return null;
    return { date, ...entry };
  }

  /** 특정 날짜의 오버라이드 저장/업데이트 (upsert) */
  function setOverride(date: string, patch: Partial<Omit<DailyTimeOverride, "date">>) {
    setStore((prev) => ({
      ...prev,
      [date]: {
        ...{ startTime: null, endTime: null },
        ...prev[date],
        ...patch,
      },
    }));
  }

  /** 특정 날짜의 오버라이드 삭제 */
  function deleteOverride(date: string) {
    setStore((prev) => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  }

  return { getOverride, setOverride, deleteOverride } as const;
}
