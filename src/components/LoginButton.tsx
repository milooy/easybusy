"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth";
import { css } from "../../styled-system/css";

export const LoginButton = () => {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Button onClick={handleLogin} className={css({ w: "full" })}>
      Login with Google
    </Button>
  );
};
