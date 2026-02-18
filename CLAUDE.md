# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # 개발 서버 실행 (Turbopack)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 코드 검사
npm run prepare      # PandaCSS codegen (의존성 설치 후 자동 실행)
```

테스트 프레임워크는 아직 미설정 상태.

## Architecture

Next.js App Router 기반 풀스택 앱. Google Calendar 연동 캘린더 서비스.

### 기술 스택
- **Next.js 16 + React 19 + TypeScript** (App Router)
- **Supabase**: 인증(OAuth), 데이터베이스, SSR 클라이언트 분리(`supabase.ts` / `supabase-server.ts`)
- **TanStack Query**: 서버 상태 관리 및 캐싱
- **PandaCSS**: 스타일링 (`css()` 함수, 다크모드 토큰, `styled-system/` 생성 디렉토리)
- **Radix UI + Lucide React**: UI 컴포넌트 및 아이콘

### 핵심 데이터 흐름
1. **인증**: `AuthContext` → Supabase Auth → Google/Kakao OAuth → `/auth/callback` 라우트
2. **Google Calendar**: `useGoogleCalendar` 훅 → `google-token.ts`(토큰 갱신) → `google-calendar.ts`(API 호출)
3. **캐싱 전략**: TanStack Query로 `authSession`(5분), `googleTokenPairs`(5분), `googleEvents`(2분) staleTime 관리

### 라우팅
- `/` → 랜딩 페이지
- `/login` → 로그인 (GuestGuard 보호)
- `/app` → 메인 앱 (AuthGuard 보호)
- `/auth/callback` → OAuth 콜백 처리
- `/api/google/*` → Google OAuth 서버 API

### Supabase 클라이언트 패턴
- 클라이언트 컴포넌트: `src/lib/supabase.ts` (`createBrowserClient`)
- 서버 컴포넌트/API 라우트: `src/lib/supabase-server.ts` (`createServerClient`)

### 스타일링 규칙
- PandaCSS `css()` 함수로 스타일 작성, inline style 지양
- 다크모드: `.dark &` 조건부 스타일 토큰 사용
- 컬러: oklch 포맷 기반 토큰 시스템 (`panda.config.ts`)
- 레이아웃 패턴: `flex()`, `grid()` 유틸리티 사용

### 컴포넌트 규칙
- 클라이언트 컴포넌트에 `"use client"` 지시문 필수
- path alias: `@/*` → `src/*`

## Code Rules

코드 작성 시 반드시 준수해야 하는 규칙:

@.claude/rules/component-structure.md
@.claude/rules/code-style.md

## Domain Knowledge

프로젝트 도메인 지식 (구조, 계산 방식, 데이터 흐름):

@.claude/knowledge/todo.md
@.claude/knowledge/calendar-timeline.md
@.claude/knowledge/dnd-pattern.md

## Environment Variables

`.env.local` 필요 (env.example 참고):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_SECRET` (서버사이드 토큰 갱신용)
