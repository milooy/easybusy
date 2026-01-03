# 이걸로 바이브코딩 다할거야

## 기술 스택

- **프레임워크**: Next.js 15.3.2
- **언어**: TypeScript
- **UI 라이브러리**: React 19
- **스타일링**: Tailwind CSS 4
- **데이터베이스**: Supabase
- **UI 컴포넌트**: Radix UI, Shadcn UI, Lucide React

## 주요 기능

- Supabase를 활용한 서버리스 백엔드 통합
- Radix UI를 활용한 접근성 높은 UI 컴포넌트
- Vercel Analytics 통합
- TypeScript를 통한 타입 안정성
- ESLint를 통한 코드 품질 관리
- Tailwind CSS를 활용한 반응형 디자인

## 프로젝트 구조

```
src/
├── app/        # Next.js 앱 라우터
├── components/ # 재사용 가능한 UI 컴포넌트
├── contexts/   # React Context 관련 파일
└── lib/        # 유틸리티 함수 및 설정
```

## Serverless 프로젝트 생성 및 연동

1. Supabase 프로젝트 생성
2. env.example 파일 기반으로 .env.local 파일 생성 및 supabase key 붙여넣기
3. Supabase > Authentication > Sign In / Providers > Google 설정
4. Google cloud 프로젝트 생성
5. Google cloud OAuth 클라이언트 ID 만들기

- 승인된 JavaScript 원본: 생성한 supabase 주소(Supabase settings > Data API > Project URL) (e.g. https://abc.supabase.co)
- 승인된 리디렉션 URI: supabase google provider에서 제공한 callback URL (e.g. https://abc.supabase.co/auth/v1/callback)
- 생성시 나온 클라이언트ID, secret (e.g. abc.apps.googleusercontent.com)을 Supabase 의 google provider의 Cliend Ids에 붙여넣기

6. Vercel 프로젝트 생성 및 연동

- vercel 설정에 environment variables 추가

## 시작하기

1. 환경 설정

```bash
cp env.example .env.local
```

2. 의존성 설치

```bash
npm install
```

3. 개발 서버 실행

```bash
npm run dev
```

## 스크립트

- `npm run dev`: 개발 서버 실행 (Turbopack 사용)
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: ESLint를 통한 코드 검사

# Vercel 환경 변수 설정 가이드

## 1. Vercel 대시보드에서 환경 변수 설정

Vercel 프로젝트 설정에서 다음 환경 변수를 추가하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://kcvzukpsrulvenfxzjph.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjdnp1a3BzcnVsdmVuZnh6anBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjQ1NzAsImV4cCI6MjA2NTc0MDU3MH0.oMbsSTqIQh2mIwHOVT7L4wXhujvUtgnzB6pzsdD0aJ4
NEXT_PUBLIC_APP_URL=https://donedrop.vercel.app
```

## 2. Supabase 설정에서 허용된 리다이렉트 URL 추가

Supabase 대시보드 → Authentication → URL Configuration에서 다음 URL들을 추가하세요:

### Site URL:

- `https://donedrop.vercel.app`

### Redirect URLs:

- `https://donedrop.vercel.app/auth/callback`
- `http://localhost:3000/auth/callback` (개발용)

## 3. GitHub OAuth 앱 설정

GitHub Developer Settings에서 OAuth 앱의 Authorization callback URL을 다음과 같이 설정하세요:

### Authorization callback URL:

- `https://kcvzukpsrulvenfxzjph.supabase.co/auth/v1/callback`

## 4. 배포 후 테스트

1. https://donedrop.vercel.app에서 GitHub 로그인 테스트
2. 로그인 후 https://donedrop.vercel.app/app으로 올바르게 리다이렉트되는지 확인

## 문제 해결

만약 여전히 localhost로 리다이렉트된다면:

1. Vercel 환경 변수가 올바르게 설정되었는지 확인
2. 다시 배포하여 환경 변수 변경사항 반영
3. 브라우저 캐시 클리어
