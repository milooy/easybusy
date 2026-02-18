import { useState, useEffect, useRef, useMemo } from "react";

export const useCurrentTime = (
  startHour: number,
  endHour: number,
  isActive: boolean
) => {
  const [now, setNow] = useState(() => new Date());
  const currentTimeRef = useRef<HTMLDivElement>(null);

  // 1분마다 현재 시간 갱신
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // 현재 시간 인디케이터가 마운트되면 스크롤
  useEffect(() => {
    if (!isActive || !currentTimeRef.current) return;
    // 약간의 지연 후 스크롤 (렌더링 완료 대기)
    const timer = setTimeout(() => {
      currentTimeRef.current?.scrollIntoView({ block: "center", behavior: "instant" });
    }, 100);
    return () => clearTimeout(timer);
  }, [isActive]);

  const currentTimeTop = useMemo(() => {
    const currentHour = now.getHours() + now.getMinutes() / 60;
    if (currentHour < startHour || currentHour > endHour) return null;
    return (currentHour - startHour) * 60;
  }, [now, startHour, endHour]);

  const currentTimeLabel = useMemo(
    () =>
      `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
    [now]
  );

  return { currentTimeRef, currentTimeTop, currentTimeLabel };
};
