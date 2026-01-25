"use client";

import { css } from "../../../styled-system/css";
import { Footer } from "@/components/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: "md" | "3xl" | "4xl";
  showFooter?: boolean;
}

export function PageLayout({
  children,
  maxWidth = "3xl",
  showFooter = true,
}: PageLayoutProps) {
  const maxWidthMap = {
    md: "md",
    "3xl": "3xl",
    "4xl": "4xl",
  } as const;

  return (
    <div
      className={css({
        minH: "screen",
        bg: "gray.50",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div className={css({ flex: "1" })}>
        <div
          className={css({
            maxW: maxWidthMap[maxWidth],
            mx: "auto",
            p: "4",
          })}
        >
          {children}
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}
