"use client";

import { LoginButton } from "@/components/LoginButton";
import { useAuth } from "@/contexts/AuthContext";
import { css } from "../../styled-system/css";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={css({ minH: "screen", display: "flex", alignItems: "center", justifyContent: "center" })}>
        loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className={css({ minH: "screen", display: "flex", alignItems: "center", justifyContent: "center", bg: "gray.50" })}>
        <div className={css({ maxW: "md", w: "full", mx: "auto", p: "6" })}>
          <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", mb: "8" })}>
            <h1 className={css({ fontSize: "3xl", fontWeight: "bold", color: "gray.900", mb: "2" })}>My app</h1>
            <p className={css({ color: "gray.600" })}>Yurim template</p>
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  return <div>You are logged in</div>;
}