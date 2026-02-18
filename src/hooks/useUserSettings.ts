"use client";

import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";

/** 쉬는 시간 구간 */
export interface OffTimeRange {
  /** 시작 시간 (0~23) */
  startHour: number;
  /** 종료 시간 (1~24) */
  endHour: number;
}

/** 유저 캘린더 설정 */
export interface UserSettings {
  /** 하루 시작 시간 (0~23), null이면 0시 */
  dailyStartTime: number | null;
  /** 하루 종료 시간 (1~24), null이면 24시 */
  dailyEndTime: number | null;
  /** 쉬는 시간 목록 */
  dailyOffTimes: OffTimeRange[];
}

const DEFAULT_USER_SETTINGS: UserSettings = {
  dailyStartTime: null,
  dailyEndTime: null,
  dailyOffTimes: [],
};

/**
 * 유저 캘린더 설정을 localStorage에서 관리하는 훅
 */
export function useUserSettings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>(
    STORAGE_KEYS.USER_SETTINGS,
    DEFAULT_USER_SETTINGS
  );

  return { settings, setSettings } as const;
}
