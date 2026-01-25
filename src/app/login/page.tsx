"use client";

import { GuestGuard } from "@/components/AuthGuard";
import { LoginButton } from "@/components/LoginButton";
import { css } from "../../../styled-system/css";

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className={css({ minH: "screen", display: "flex", alignItems: "center", justifyContent: "center", bg: "gray.50" })}>
        <div className={css({ maxW: "md", w: "full", mx: "auto", p: "6" })}>
          <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", mb: "8" })}>
            <h1 className={css({ fontSize: "3xl", fontWeight: "bold", color: "gray.900", mb: "2" })}>Easybusy</h1>
            <p className={css({ color: "gray.600" })}>바쁜 일상을 쉽게 관리하세요</p>
          </div>
          <LoginButton />
        </div>
      </div>
    </GuestGuard>
  );
}
