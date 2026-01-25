"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle, signInWithKakao } from "@/lib/auth";
import { css } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";

export const LoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (error) {
      console.error("Kakao login failed:", error);
    }
  };

  return (
    <div className={flex({ direction: "column", gap: "3" })}>
      <Button onClick={handleGoogleLogin} className={css({ w: "full" })}>
        Login with Google
      </Button>
      <Button
        onClick={handleKakaoLogin}
        className={css({ w: "full", bg: "#FEE500", color: "#000", _hover: { bg: "#FDD800" } })}
      >
        Login with Kakao
      </Button>
    </div>
  );
};
