"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * SSR 안전한 localStorage 훅
 * @param key 로컬스토리지 키
 * @param initialValue 초기값
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // SSR에서는 초기값 사용, 클라이언트에서는 저장된 값 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 클라이언트 하이드레이션 후 localStorage에서 값 읽기
  // + 같은 탭의 다른 useLocalStorage 인스턴스 변경 감지
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as T;
        setStoredValue(parsed);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }

    const handleLocalStorageChange = (e: Event) => {
      const { key: changedKey } = (e as CustomEvent<{ key: string }>).detail;
      if (changedKey !== key) return;

      try {
        const item = window.localStorage.getItem(key);
        if (item) setStoredValue(JSON.parse(item) as T);
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
    };

    window.addEventListener("localstorage-sync", handleLocalStorageChange);
    return () => window.removeEventListener("localstorage-sync", handleLocalStorageChange);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // 함수형 업데이트 지원
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // 같은 탭의 다른 인스턴스에게 변경 알림
          window.dispatchEvent(new CustomEvent("localstorage-sync", { detail: { key } }));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
