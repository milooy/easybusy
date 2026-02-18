---
name: wrapup
description: 세션에서 배운 것을 .claude/rules/ 또는 .claude/knowledge/에 정리한다.
disable-model-invocation: true
---

# 세션 마무리 - 학습 내용 정리

이번 세션의 대화 내역을 돌아보고, 내용의 성격에 따라 아래 두 폴더 중 적절한 곳에 기록한다.

## 폴더 구분

| 폴더 | 성격 | 예시 |
|------|------|------|
| `.claude/rules/` | **반드시 따를 규칙** — 코드 작성 방식, 컴포넌트 구조 원칙 | `code-style.md`, `component-structure.md` |
| `.claude/knowledge/` | **참고용 도메인 지식** — 구조, 계산 방식, 데이터 흐름, 패턴 | `todo.md`, `calendar-timeline.md`, `dnd-pattern.md` |

> `.claude/rules/`는 Claude Code가 자동으로 읽는다.
> `.claude/knowledge/`는 CLAUDE.md의 `## Domain Knowledge` 섹션에서 `@` 참조로 로드된다.
> **새 knowledge 파일을 추가하면 반드시 CLAUDE.md의 해당 섹션에도 `@경로`를 추가해야 한다.**

## 기준

기록할 만한 내용:
- 이 프로젝트에서 반복적으로 쓰일 패턴이나 규칙
- 처음 알게 된 도메인 지식 (구조, 계산 방식, 데이터 흐름 등)
- 실수하거나 헷갈렸던 부분의 해결책

기록하지 않을 내용:
- 이번 한 번만 쓸 구현 세부사항
- 이미 CLAUDE.md에 있는 내용

## 절차

1. 세션 대화를 돌아보며 기록할 인사이트를 추출한다.
2. **규칙**인지 **도메인 지식**인지 구분한다.
3. 주제별로 묶어 적절한 파일명을 결정한다.
4. 기존 파일이 있으면 병합, 없으면 신규 생성한다.
5. 각 파일은 **핵심만** 담는다. 예시 코드는 꼭 필요한 경우만.
6. `.claude/knowledge/`에 새 파일을 만든 경우, CLAUDE.md의 `## Domain Knowledge`에 `@` 참조를 추가한다.
7. 변경된 파일을 커밋한다.

## 출력 형식

작업 완료 후 다음을 보여준다:
- 생성/수정된 파일 목록과 각각 어떤 내용을 담았는지 한 줄 요약
