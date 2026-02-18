"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";

interface AppHeaderProps {
  showSettings?: boolean;
  onSignOut: () => void;
}

export function AppHeader({ showSettings, onSignOut }: AppHeaderProps) {
  return (
    <div
      className={flex({
        justify: "space-between",
        align: "center",
        mb: "6",
      })}
    >
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
          color: "gray.900",
        })}
      >
        Easybusy
      </h1>
      <div className={css({ display: "flex", gap: "2" })}>
        {showSettings && (
          <Link
            href="/app/settings"
            className={css({
              display: "flex",
              alignItems: "center",
              px: "2",
              py: "1.5",
              color: "gray.600",
              borderRadius: "md",
              border: "1px solid",
              borderColor: "gray.300",
              cursor: "pointer",
              _hover: { bg: "gray.100" },
            })}
          >
            <Settings size={16} />
          </Link>
        )}
        <button
          onClick={onSignOut}
          className={css({
            px: "3",
            py: "1.5",
            fontSize: "sm",
            color: "red.600",
            borderRadius: "md",
            border: "1px solid",
            borderColor: "red.300",
            cursor: "pointer",
            _hover: { bg: "red.50" },
          })}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
