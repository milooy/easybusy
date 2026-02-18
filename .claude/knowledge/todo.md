# 투두 도메인 지식

## 모델 구조 (`src/types/todo.ts`)

```ts
interface Todo {
  id: string;
  title: string;
  description?: string;     // 마크다운 형태
  createdTime: string;      // ISO 8601
  completed: boolean;
  folderId: string;         // TODO_FOLDERS의 id
  assignedDate?: string;    // "YYYY-MM-DD"
  assignedHour?: number;    // 슬롯 시작 시간 소수점 (e.g. 12.5 = 12:30)
}
```

## 폴더 시스템

- 정적 폴더 목록: `TODO_FOLDERS` 상수 (`src/types/todo.ts`)
- 현재 폴더: `"none"` (폴더없음), `"work"` (업무)
- 신규 투두의 기본 folderId: `"none"`

## 슬롯 연결 방식

날짜 + 시간을 별도 필드로 저장해 유연성 확보:
- `assignedDate`: 날짜 (YYYY-MM-DD 문자열)
- `assignedHour`: 슬롯 시작 시각 (캘린더 타임라인과 동일한 소수점 시간 단위)
- 특정 날짜의 12:00-13:00 슬롯 → `assignedDate: "2025-01-02"`, `assignedHour: 12`

## Storage

- 키: `STORAGE_KEYS.TODOS` = `"easybusy:todos"`
- 훅: `useTodos()` (`src/hooks/useTodos.ts`)
  - `addTodo(title, options?)` / `updateTodo(id, changes)` / `deleteTodo(id)` / `toggleTodo(id)`

## 인박스 표시 규칙

- 활성 투두: `!completed && !assignedDate` — 캘린더에 배정된 투두는 인박스에서 숨긴다
- 완료 투두: `completed` — assignedDate 여부와 무관하게 완료 섹션에 표시

## 앱 레이아웃에서 위치

`/app/app/page.tsx`에서 캘린더 우측에 `<TodoInbox />` 사이드바(w: 280px) 배치.
`PageLayout`의 maxWidth는 캘린더 연결 시 `"4xl"` 사용.

## useLocalStorage 다중 인스턴스 주의

`useTodos()`를 여러 컴포넌트에서 각각 호출하면 **독립적인 React 상태**를 가진다.
한 컴포넌트에서 `updateTodo`를 호출해도 다른 컴포넌트는 즉시 반영되지 않는다.

→ 해결: `useLocalStorage`에 `localstorage-sync` 커스텀 이벤트 동기화 내장됨 (`setValue` 시 dispatch, `useEffect`에서 listen).
