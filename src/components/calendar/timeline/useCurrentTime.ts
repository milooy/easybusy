import { useState, useEffect, useRef, useMemo } from "react";

export const useCurrentTime = (
  startHour: number,
  endHour: number,
  isActive: boolean
) => {
  const [now, setNow] = useState(() => new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1분마다 현재 시간 갱신
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // 마운트 시 현재 시간 위치로 자동 스크롤
  useEffect(() => {
    if (!isActive || !scrollContainerRef.current) return;
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const scrollTop = (currentHour - startHour) * 60 - 120;
    scrollContainerRef.current.scrollTop = Math.max(0, scrollTop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return { scrollContainerRef, currentTimeTop, currentTimeLabel };
};
