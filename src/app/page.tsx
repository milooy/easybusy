"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { css } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";
import { PageLayout } from "@/components/layout/PageLayout";
import { FeatureCard } from "@/components/landing/FeatureCard";

const FEATURES = [
  {
    icon: "📅",
    title: "구글 캘린더 연동",
    description: "여러 구글 계정의 캘린더를 한 곳에서 확인하세요.",
  },
  {
    icon: "⏰",
    title: "타임라인 뷰",
    description: "하루 일정을 시간순으로 깔끔하게 확인할 수 있습니다.",
  },
  {
    icon: "🎯",
    title: "간편한 네비게이션",
    description: "날짜를 쉽게 이동하며 일정을 확인하세요.",
  },
];

function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={css({
        display: "inline-block",
        px: "8",
        py: "3",
        fontSize: "lg",
        fontWeight: "semibold",
        color: "white",
        bg: "blue.600",
        borderRadius: "xl",
        cursor: "pointer",
        textDecoration: "none",
        _hover: { bg: "blue.700" },
      })}
    >
      {children}
    </Link>
  );
}

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <PageLayout maxWidth="4xl">
      {/* 헤더 */}
      <div
        className={flex({
          justify: "space-between",
          align: "center",
          py: "4",
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
        {!loading && (
          <Link
            href={user ? "/app" : "/login"}
            className={css({
              px: "4",
              py: "2",
              fontSize: "sm",
              fontWeight: "medium",
              color: "white",
              bg: "blue.600",
              borderRadius: "lg",
              cursor: "pointer",
              textDecoration: "none",
              _hover: { bg: "blue.700" },
            })}
          >
            {user ? "앱으로 이동" : "로그인"}
          </Link>
        )}
      </div>

      {/* 히어로 섹션 */}
      <div
        className={css({
          textAlign: "center",
          py: "20",
        })}
      >
        <h2
          className={css({
            fontSize: "4xl",
            fontWeight: "bold",
            color: "gray.900",
            mb: "4",
            lineHeight: "tight",
          })}
        >
          바쁜 일상을 쉽게 관리하세요
        </h2>
        <p
          className={css({
            fontSize: "lg",
            color: "gray.600",
            mb: "8",
            maxW: "2xl",
            mx: "auto",
          })}
        >
          구글 캘린더와 연동하여 하루 일정을 한눈에 확인하고
          <br />
          효율적으로 시간을 관리할 수 있습니다.
        </p>
        {!loading && (
          <CTAButton href={user ? "/app" : "/login"}>
            {user ? "앱으로 이동" : "시작하기"}
          </CTAButton>
        )}
      </div>

      {/* 기능 소개 */}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
          gap: "6",
          py: "12",
        })}
      >
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </PageLayout>
  );
}
