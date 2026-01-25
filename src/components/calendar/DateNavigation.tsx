"use client";

import { Button } from "@/components/ui/button";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";

interface DateNavigationProps {
  date: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export const DateNavigation = ({ date, onPrevDay, onNextDay, onToday }: DateNavigationProps) => {
  const formatDate = (d: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return d.toLocaleDateString("ko-KR", options);
  };

  const isToday = () => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return (
    <div className={flex({ align: "center", justify: "space-between", gap: "4" })}>
      <div className={flex({ align: "center", gap: "2" })}>
        <Button variant="outline" size="sm" onClick={onPrevDay}>
          ←
        </Button>
        <Button variant="outline" size="sm" onClick={onNextDay}>
          →
        </Button>
        {!isToday() && (
          <Button variant="ghost" size="sm" onClick={onToday}>
            오늘
          </Button>
        )}
      </div>

      <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900" })}>
        {formatDate(date)}
      </h2>
    </div>
  );
};
