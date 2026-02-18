# 컴포넌트 구조 규칙

## 복잡한 컴포넌트 분리 패턴

하나의 컴포넌트 파일이 다음 중 하나에 해당하면 하위 디렉토리로 분리한다:
- 상태 로직 + 순수 함수 + UI가 혼재
- 200줄 이상

### 디렉토리 구조 (예: DailyTimeline)
```
ComponentName.tsx          ← 오케스트레이터만 담당 (props 받아 하위 조합)
componentName/
├── componentNameUtils.ts  ← 순수 함수 & 상수 (React 없음, 단독 테스트 가능)
├── useXxx.ts              ← 상태/effect/computed 로직 훅
├── SubComponentA.tsx      ← 단일 책임 UI 컴포넌트
└── SubComponentB.tsx
```

### 실제 예시
```
DailyTimeline.tsx
timeline/
├── timelineUtils.ts       순수 함수 (getFreeSlots, getEventPosition, formatHour)
├── useCurrentTime.ts      현재 시간 상태 & 자동 스크롤
├── AllDayEvents.tsx       종일 일정 섹션
├── FreeSlotBlock.tsx      빈 슬롯 블록
├── OffTimeBlock.tsx       휴식 블록
├── TimedEventBlock.tsx    이벤트 블록
└── CurrentTimeIndicator.tsx  빨간 현재 시간 선
```

## 오케스트레이터 원칙
- 오케스트레이터는 props 수신 → 데이터 분류 → 하위 컴포넌트 조합만 담당
- 비즈니스 로직, 스타일 상세는 하위 파일로 위임

## 파일 내 컴포넌트 순서

메인(진입점) 컴포넌트를 파일 상단에, 보조 컴포넌트는 하단에 배치한다.

```tsx
// ✅ 올바른 순서
export default function AppPage() { ... }   // 메인 - 상단

function AppContent() { ... }               // 핵심 로직
function LoadingState() { ... }             // 보조 - 하단
function GoogleConnectState() { ... }       // 보조 - 하단

// ❌ 잘못된 순서
function LoadingState() { ... }             // 보조가 먼저
function AppPage() { ... }                  // 메인이 하단
```
