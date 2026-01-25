---
name: commit
description: |
  커밋 메시지 생성 스킬. 다음 상황에서 자동 호출:
  - "커밋", "commit", "커밋 메시지", "커밋해줘", "커밋 부탁"
  - "변경사항 커밋", "staged 커밋", "git commit"
---

# Git 커밋 자동화

## 규칙

- 기능 단위로 즉시 커밋 (큰 작업은 작은 단위로 분할)
- **반드시 사용자 승인 후 커밋 실행**
- Conventional Commit 형식 사용
- 한국어로 간결하게 작성 (50자 이내)

## Conventional Commit 타입

- ✨ feat: 새로운 기능
- 🐛 fix: 버그 수정
- 📝 docs: 문서 변경
- ♻️ refactor: 리팩토링
- ✅ test: 테스트 추가/수정
- 🔧 chore: 설정 변경

## 프로세스

1. `git status`와 `git diff`로 변경사항 분석
2. 변경 내용에 맞는 타입과 메시지 생성
3. **변경사항 요약과 커밋 메시지를 사용자에게 제시**
4. **사용자 승인 확인 (필수)**
5. 승인 시에만 `git add -A` 후 `git commit` 실행
