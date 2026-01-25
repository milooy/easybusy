"use client";

import Link from "next/link";
import { css } from "../../styled-system/css";

export const Footer = () => {
  return (
    <footer
      className={css({
        py: "6",
        mt: "auto",
        borderTop: "1px solid",
        borderColor: "gray.200",
        bg: "white",
      })}
    >
      <div className={css({ maxW: "3xl", mx: "auto", px: "4" })}>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2",
            fontSize: "sm",
            color: "gray.500",
          })}
        >
          <span className={css({ fontWeight: "semibold", color: "gray.700" })}>
            Easybusy
          </span>
          <div className={css({ display: "flex", gap: "4" })}>
            <Link
              href="/privacy"
              className={css({ _hover: { color: "gray.700", textDecoration: "underline" } })}
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className={css({ _hover: { color: "gray.700", textDecoration: "underline" } })}
            >
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
