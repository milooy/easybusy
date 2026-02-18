# DnD 패턴 (@dnd-kit)

## 라이브러리
- `@dnd-kit/core` + `@dnd-kit/utilities`
- React 18+ 공식 지원, 접근성 내장

## DndContext 위치
`app/page.tsx`의 캘린더+인박스 wrapper에 wrap.
`onDragStart`, `onDragEnd`, `onDragCancel` 세 가지 모두 등록한다.

```tsx
<DndContext
  sensors={sensors}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  onDragCancel={handleDragCancel}  // 반드시 추가 — Escape 취소 시 onDragEnd 미호출
>
```

## PointerSensor 설정
클릭과 드래그를 구분하기 위해 `activationConstraint` 필수:
```tsx
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
);
```

## Droppable ID 형식
`freeslot_${YYYY-MM-DD}_${slotStart}` (구분자 `_`, 날짜에 `-` 사용)

파싱:
```tsx
const parts = overId.split("_");
const assignedDate = parts[1]; // "2025-01-15"
const assignedHour = parseFloat(parts[2]); // 14.5
```

## DragOverlay (마우스 추종 미리보기)
- `DndContext` 안에 `<DragOverlay>` 배치
- `onDragStart`에서 `activeTodo` state 저장, `onDragEnd/onDragCancel`에서 null 초기화
- DragOverlay는 portal로 렌더링되어 z-index 문제 없음

```tsx
const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

const handleDragStart = (e: DragStartEvent) => {
  setActiveTodo(todos.find((t) => t.id === e.active.id) ?? null);
};
const handleDragCancel = () => setActiveTodo(null);
const handleDragEnd = (e: DragEndEvent) => {
  setActiveTodo(null);
  // drop 처리 로직
};

<DragOverlay>
  {activeTodo && <TodoDragPreview todo={activeTodo} />}
</DragOverlay>
```

## Draggable 드래그 핸들 패턴
전체 아이템이 아닌 별도 핸들 버튼에만 `listeners/attributes` 적용:
```tsx
const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: todo.id });

<div ref={setNodeRef} style={{ opacity: isDragging ? 0.4 : 1 }}>
  <button {...listeners} {...attributes}><GripVertical /></button>
  {/* 나머지 UI — 클릭 이벤트 정상 동작 */}
</div>
```

## 슬롯별 투두 그룹화 (성능)
슬롯마다 `todos.filter()` 인라인 실행 대신, `useMemo`로 Map 사전 생성:
```tsx
const todosBySlotStart = useMemo(() => {
  const map = new Map<number, Todo[]>();
  todos.forEach((t) => {
    if (t.assignedDate === selectedDateStr && t.assignedHour !== undefined) {
      const list = map.get(t.assignedHour) ?? [];
      map.set(t.assignedHour, [...list, t]);
    }
  });
  return map;
}, [todos, selectedDateStr]);

// 사용
assignedTodos={todosBySlotStart.get(slotStart) ?? []}
```
