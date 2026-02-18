"use client";

import { Button } from "@/components/ui/button";
import { formatDateFull, isToday } from "@/lib/date-utils";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";

interface DateNavigationProps {
  date: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export const DateNavigation = ({ date, onPrevDay, onNextDay, onToday }: DateNavigationProps) => {
  return (
    <div className={flex({ align: "center", justify: "space-between", gap: "4" })}>
      <div className={flex({ align: "center", gap: "2" })}>
        <Button variant="outline" size="sm" onClick={onPrevDay}>
          ←
        </Button>
        <Button variant="outline" size="sm" onClick={onNextDay}>
          →
        </Button>
        {!isToday(date) && (
          <Button variant="ghost" size="sm" onClick={onToday}>
            오늘
          </Button>
        )}
      </div>

      <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900" })}>
        {formatDateFull(date)}
      </h2>
    </div>
  );
};
