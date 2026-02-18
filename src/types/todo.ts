/**
 * 투두 폴더
 */
export interface TodoFolder {
  id: string;
  name: string;
}

/**
 * 정적 폴더 목록 (현재는 고정)
 */
export const TODO_FOLDERS: TodoFolder[] = [
  { id: "none", name: "폴더없음" },
  { id: "work", name: "업무" },
];

/**
 * 투두 아이템
 */
export interface Todo {
  id: string;
  title: string;
  /** 마크다운 형태로 추후 렌더링 가능 */
  description?: string;
  createdTime: string; // ISO 8601
  completed: boolean;
  folderId: string; // TODO_FOLDERS의 id
  /** 배정된 날짜 (YYYY-MM-DD) */
  assignedDate?: string;
  /** 배정된 슬롯 시작 시간 (소수점 시간, e.g. 12.5 = 12:30) */
  assignedHour?: number;
  /** Plan 영역에 추가된 날짜 (YYYY-MM-DD). assignedDate 없이 이 값만 있으면 Plan 상태 */
  plannedDate?: string;
}
