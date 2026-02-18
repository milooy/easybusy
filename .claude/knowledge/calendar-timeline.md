# 캘린더 타임라인 도메인 지식

## 시간 단위 체계
- **1시간 = 60px** (고정)
- 시간 표현: 소수점 시간 (e.g. 14:30 = 14.5)
- 변환: `hours + minutes / 60`

## 블록 위치 계산
```ts
const top = (blockStartHour - timelineStartHour) * 60 + BLOCK_MARGIN;
const height = (blockEndHour - blockStartHour) * 60 - BLOCK_MARGIN * 2;
```

## BLOCK_MARGIN
- 값: `2` (px)
- 목적: 블록 간 시각적 여백 (position: absolute라 margin 대신 top/height 조정)
- 위치: `timeline/timelineUtils.ts`의 `BLOCK_MARGIN` 상수

## 설정값 출처 (useUserSettings)
| 설정 | 키 | 기본값 |
|------|-----|--------|
| 하루 시작 시간 | `dailyStartTime` | `null` → 0으로 처리 |
| 하루 종료 시간 | `dailyEndTime` | `null` → 24로 처리 |
| 휴식 시간 목록 | `dailyOffTimes` | `OffTimeRange[]` |

## 빈 슬롯 계산 (`getFreeSlots`)
- 입력: startHour, endHour, offTimes, timedEvents
- 로직: occupied 구간(offTimes + events) 병합 후 반전
- 위치: `timeline/timelineUtils.ts`

## 레이아웃 구조
```
position: relative, display: flex
├── 시간 레이블 (width: 60px, flexShrink: 0)
│   └── 현재 시간 라벨 (position: absolute, 시간 영역에 표시)
└── 그리드 영역 (flex: 1, position: relative)
    ├── 그리드 배경선 (height: 60px per hour)
    ├── FreeSlotBlock (z-index: 0)
    ├── OffTimeBlock (z-index: 0)
    ├── TimedEventBlock (z-index: 기본)
    └── CurrentTimeIndicator (z-index: 10)
```

## 현재 시간 인디케이터
- 오늘(`isToday(selectedDate)`)인 경우에만 표시
- 1분마다 갱신 (`setInterval 60 * 1000`)
- 마운트 시 현재 시간으로 자동 스크롤 (현재 위치 - 120px)
- 훅 위치: `timeline/useCurrentTime.ts`
