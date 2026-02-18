---
name: issue
description: GitHub 이슈 기반 개발 워크플로우. 이슈 선택, 브랜치 생성, 작업 계획, 개발, 코드리뷰, PR 생성까지 전체 과정 자동화.
disable-model-invocation: true
argument-hint: "[issue-number]"
---

# GitHub 이슈 기반 개발 워크플로우

입력된 인자: `$ARGUMENTS`

## Step 1: 이슈 선택

**인자가 있는 경우** (숫자인 경우):
- `gh issue view $ARGUMENTS`로 이슈 내용을 조회한다.
- 이슈가 존재하지 않으면 사용자에게 알리고 중단한다.

**인자가 없거나 숫자가 아닌 경우**:
- `gh project item-list 3 --owner milooy --format json`으로 프로젝트 보드 항목을 조회한다.
- status가 "Todo"인 이슈들만 필터링하여 번호, 제목을 테이블로 보여준다.
- 사용자에게 작업할 이슈 번호를 선택받는다. 선택받을 때까지 다음 단계로 진행하지 않는다.

선택된 이슈 번호를 `ISSUE_NUMBER`로 기억한다.

## Step 2: 브랜치 생성

1. `git fetch origin main`으로 최신 main을 가져온다.
2. `git checkout -b feat/ISSUE_NUMBER origin/main`으로 브랜치를 생성하고 이동한다.
3. 브랜치 생성 결과를 사용자에게 알린다.

## Step 3: 작업 계획 수립

1. 이슈 본문의 내용을 꼼꼼히 분석한다.
2. 프로젝트의 기존 코드베이스를 탐색하여 관련 파일과 패턴을 파악한다.
3. 이슈를 유의미한 서브태스크로 분할한다. 각 서브태스크는:
   - 독립적으로 커밋 가능한 단위
   - 명확한 완료 조건이 있는 단위
   - 기능적으로 의미있는 단위
4. 프로젝트 루트에 `.workplan-ISSUE_NUMBER.md` 파일을 생성한다. (`.gitignore`에 등록되어 있어 git에 포함되지 않음)
   - 이슈 제목, 본문 요약
   - 서브태스크 목록 (체크박스 형태: `- [ ]` / `- [x]`)
   - 각 서브태스크의 상세 설명과 완료 조건
5. TodoWrite로도 서브태스크 목록을 작성한다.
6. 작업 계획을 사용자에게 보여주고 **반드시 승인을 받는다**.
   - 사용자가 수정을 요청하면 계획서와 TodoWrite를 함께 조정한다.
   - 승인받을 때까지 구현을 시작하지 않는다.

## Step 4: 서브태스크별 개발 및 커밋

승인받은 계획에 따라 서브태스크를 순차적으로 진행한다:

각 서브태스크마다:
1. `.workplan-ISSUE_NUMBER.md`에서 현재 태스크를 `🔄 진행중`으로 표시하고, TodoWrite에서도 `in_progress`로 변경한다.
2. 구현을 진행한다.
3. 구현이 끝나면 `.workplan-ISSUE_NUMBER.md`에서 해당 태스크를 `- [x]`로 체크하고 `git add`로 관련 파일을 스테이징한다.
4. Conventional Commit 형식으로 커밋한다:
   - 커밋 메시지는 한국어로 작성
   - 이모지 + 타입: feat, fix, refactor, docs, chore, test 등
   - 예시: `✨ feat(calendar): 데일리 캘린더 시작/종료 시간 설정 기능 추가`
5. TodoWrite에서 해당 태스크를 `completed`로 변경한다.
6. 다음 서브태스크로 이동한다.

**중요**: 각 커밋은 빌드가 깨지지 않는 상태를 유지해야 한다.

## Step 5: 작업 완료 확인

모든 서브태스크가 완료되면:
1. `npm run build`로 빌드가 정상인지 확인한다.
2. `npm run lint`로 린트 에러가 없는지 확인한다.
3. 전체 변경사항 요약을 사용자에게 보여준다:
   - 완료된 서브태스크 목록
   - 커밋 히스토리 (`git log --oneline origin/main..HEAD`)
   - 변경된 파일 목록
4. **사용자에게 최종 확인을 받는다**. 승인 전까지 PR을 생성하지 않는다.

## Step 6: 코드 품질 리뷰 및 리팩토링

1. `git diff origin/main..HEAD`로 main 브랜치 대비 전체 변경사항을 확인한다.
2. 다음 관점에서 코드 품질을 점검한다:
   - 불필요한 코드, 중복 로직, 사용하지 않는 import가 없는지
   - 네이밍이 명확하고 일관적인지
   - 컴포넌트 구조와 책임 분리가 적절한지
   - 프로젝트 컨벤션(PandaCSS, 클라이언트 컴포넌트 지시문 등)을 준수하는지
   - 타입 정의가 적절한지
3. 개선이 필요한 부분이 있으면 리팩토링을 진행하고, `♻️ refactor: ...` 형식으로 커밋한다.
4. 리팩토링 후 `npm run build`와 `npm run lint`로 빌드/린트가 정상인지 재확인한다.

## Step 7: PR 생성 및 배포 URL 제공

사용자 승인 후:
1. `.workplan-ISSUE_NUMBER.md` 파일을 삭제한다.
2. `git push -u origin feat/ISSUE_NUMBER`로 브랜치를 푸시한다.
3. `gh pr create`로 PR을 생성한다:
   - 제목: 이슈 제목과 동일
   - 본문에 포함할 내용:
     - `## Summary`: 변경사항 요약 (bullet points)
     - `## Changes`: 서브태스크별 변경 내용
     - `Closes #ISSUE_NUMBER`: 이슈 자동 연결
   - base 브랜치: main
4. PR URL을 사용자에게 보여준다.
5. Vercel Preview 배포 URL을 안내한다:
   - `gh pr checks`로 Vercel 배포 상태를 확인한다.
   - 배포가 아직 진행중이면 "Vercel 배포가 진행중입니다. PR 페이지에서 확인해주세요." 라고 안내한다.
   - 배포 URL이 확인되면 직접 URL을 보여준다.

## 주의사항

- 모든 단계에서 한국어로 소통한다.
- 각 단계 전환 시 사용자에게 현재 진행 상황을 알린다.
- 에러 발생 시 즉시 사용자에게 알리고 대응 방안을 제시한다.
- CLAUDE.md의 프로젝트 규칙(PandaCSS 스타일링, 클라이언트 컴포넌트 지시문 등)을 준수한다.
