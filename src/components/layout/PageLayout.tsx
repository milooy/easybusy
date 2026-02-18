"use client";

import { css } from "../../../styled-system/css";
import { Footer } from "@/components/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: "md" | "3xl" | "4xl";
  showFooter?: boolean;
  fullHeight?: boolean;
}

export function PageLayout({
  children,
  maxWidth = "3xl",
  showFooter = true,
  fullHeight = false,
}: PageLayoutProps) {
  const maxWidthMap = {
    md: "md",
    "3xl": "3xl",
    "4xl": "4xl",
  } as const;

  return (
    <div
      className={css({
        bg: "gray.50",
        display: "flex",
        flexDirection: "column",
        ...(fullHeight
          ? { h: "100vh", overflow: "hidden" }
          : { minH: "screen" }),
      })}
    >
      <div
        className={css({
          flex: "1",
          display: "flex",
          flexDirection: "column",
          ...(fullHeight ? { overflow: "hidden", minH: 0 } : {}),
        })}
      >
        <div
          className={css({
            maxW: maxWidthMap[maxWidth],
            mx: "auto",
            p: "4",
            w: "full",
            ...(fullHeight
              ? { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minH: 0 }
              : {}),
          })}
        >
          {children}
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}
