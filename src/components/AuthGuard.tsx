"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { css } from "../../styled-system/css";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultLoading = () => (
  <div className={css({ minH: "screen", display: "flex", alignItems: "center", justifyContent: "center" })}>
    loading...
  </div>
);

/**
 * 인증된 사용자만 접근 가능 - 미인증 시 /login으로 리다이렉트
 */
export const AuthGuard = ({ children, fallback = <DefaultLoading /> }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return fallback;
  if (!user) return null;

  return <>{children}</>;
};

/**
 * 미인증 사용자만 접근 가능 - 인증 시 /로 리다이렉트 (로그인 페이지용)
 */
export const GuestGuard = ({ children, fallback = <DefaultLoading /> }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return fallback;
  if (user) return null;

  return <>{children}</>;
};
