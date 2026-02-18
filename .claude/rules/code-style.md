# 코드 스타일 규칙

## PandaCSS

- 스타일은 `css()` 함수로 작성, inline style 지양
- 예외: 동적 값(계산된 px, 런타임 색상)은 `style={{ }}` 사용
  ```tsx
  // 동적 top/height: style로
  style={{ top: `${top}px`, height: `${height}px` }}
  // 동적 배경색: style로
  style={{ backgroundColor: event.calendarColor }}
  ```

## position: absolute 블록의 여백

`margin`이 absolute 요소에서 레이아웃에 영향을 주지 않으므로,
상하 여백은 `top`과 `height`를 직접 조정한다.

```ts
const MARGIN = 2;
top = calculatedTop + MARGIN;
height = calculatedHeight - MARGIN * 2;
```

## 미사용 파라미터

ESLint `argsIgnorePattern: "^_"` 설정됨 (`eslint.config.mjs`).
사용하지 않는 파라미터는 `_` prefix로 표시:
```ts
({ value, onChange: _onChange }) => { ... }
```

## import 경로

- 프로젝트 내부: `@/*` alias (`src/*` 매핑)
- PandaCSS styled-system: 상대 경로 (`../../../styled-system/css`)
  - 위치에 따라 `../` 깊이 조정 필요

## 컴포넌트 파일 규칙

- 클라이언트 컴포넌트(hooks, 이벤트 핸들러 사용)에 `"use client"` 필수
- 순수 유틸 파일(`.ts`)에는 `"use client"` 불필요
