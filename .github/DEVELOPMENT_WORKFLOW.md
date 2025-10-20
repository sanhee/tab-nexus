# Tab Nexus 개발 워크플로우 가이드

## 🎯 개요

Tab Nexus 프로젝트는 **GitHub Issues를 중심으로 한 체계적인 개발 워크플로우**를 사용합니다. WBS와 WORK_PROGRESS에 정의된 모든 Phase별 작업은 GitHub Issue로 관리되며, TDD 사이클과 연동되어 투명하고 추적 가능한 개발 프로세스를 제공합니다.

## 📋 Issue 기반 워크플로우

### 1. Phase 작업 Issue 생성

WBS의 각 Phase 작업은 다음과 같이 Issue로 관리됩니다:

```
[Phase 2.1] Zustand 컬렉션 스토어 구현 (TDD)
[Phase 2.2] 로컬 스토리지 연동 구현 (TDD)
[Phase 3.1] 컬렉션 CRUD UI 구현 (TDD)
```

#### Issue 생성 단계:
1. **템플릿 선택**: `📋 Phase Task` 템플릿 사용
2. **제목 형식**: `[Phase X.Y] 작업명`
3. **라벨 적용**:
   - Phase 라벨 (`phase-1`, `phase-2`, etc.)
   - 작업 타입 (`feat`, `test`, `refactor`)
   - TDD 사이클 (`tdd-red`, `tdd-green`, `tdd-refactor`)
   - 컴포넌트 (`component-collection`, `component-tab`, etc.)

### 2. 브랜치 전략 + Issue 연동

```bash
# Issue 기반 브랜치 생성
git checkout develop
git checkout -b feature/issue-123-collection-store

# 또는 Phase 기반 명명
git checkout -b feature/phase-2.1-collection-store
```

### 3. TDD 사이클 + Issue 트래킹

각 TDD 사이클은 Issue 댓글로 진행 상황을 업데이트:

#### 🔴 Red Phase
```bash
# 실패 테스트 작성
git add test/collection-store.test.ts
git commit -m "test: 컬렉션 스토어 기본 CRUD 실패 테스트 작성

Closes #123 - Red Phase 완료

- 컬렉션 추가/삭제/수정 테스트 케이스 작성
- 모든 테스트 실패 확인
- 다음: Green Phase 진행"

# Issue에 진행 상황 댓글 추가
gh issue comment 123 --body "🔴 Red Phase 완료
- 17개 실패 테스트 작성 완료
- 컬렉션 CRUD 및 검증 로직 테스트 케이스
- 다음: Green Phase로 최소 구현 진행"
```

#### 🟢 Green Phase
```bash
# 최소 구현으로 테스트 통과
git add src/stores/collection-store.ts
git commit -m "feat: 컬렉션 스토어 기본 구현으로 테스트 통과

Related to #123 - Green Phase 완료

- Zustand 컬렉션 스토어 기본 구조 구현
- addCollection, removeCollection 액션 구현
- 모든 테스트 통과 확인"

gh issue comment 123 --body "🟢 Green Phase 완료
- 17개 테스트 모두 통과 ✅
- 컬렉션 스토어 기본 CRUD 동작 확인
- 다음: Refactor Phase로 코드 개선 진행"
```

#### 🔵 Refactor Phase
```bash
# 코드 품질 개선
git add src/stores/collection-store.ts
git commit -m "refactor: 컬렉션 스토어 타입 안전성 및 성능 최적화

Related to #123 - Refactor Phase 완료

- TypeScript 타입 강화 및 제네릭 활용
- 메모이제이션 적용으로 성능 최적화
- 에러 처리 및 검증 로직 개선
- 모든 테스트 여전히 통과"

gh issue comment 123 --body "🔵 Refactor Phase 완료
- 타입 안전성 강화 및 성능 최적화 완료
- 코드 커버리지 95% 달성
- Phase 2.1 완전 완료 ✅"
```

### 4. Pull Request 생성 + Issue 연결

```bash
# PR 생성 시 이슈 자동 연결
gh pr create \
  --title "[Phase 2.1] 컬렉션 스토어 구현 완료 (TDD)" \
  --body "Closes #123

## Phase 2.1 컬렉션 스토어 TDD 사이클 완료

### 완료된 작업
- 🔴 Red: 17개 실패 테스트 작성
- 🟢 Green: 모든 테스트 통과하는 기본 구현
- 🔵 Refactor: 타입 안전성 및 성능 최적화

### 테스트 결과
- 총 17개 테스트 모두 통과 ✅
- 코드 커버리지 95%

## 관련 이슈
- Closes #123

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

## 🏷️ 라벨 시스템

### Phase 라벨
- `phase-1` ~ `phase-10`: WBS Phase 구분
- `tdd-red`, `tdd-green`, `tdd-refactor`: TDD 사이클 추적

### 우선순위 라벨
- `priority-high` 🔴: 블로킹 이슈, 긴급 버그
- `priority-medium` 🟡: 일반적인 개발 작업
- `priority-low` 🟢: 향후 개선사항

### 상태 라벨
- `status-ready`: 작업 시작 가능
- `status-in-progress`: 현재 진행 중
- `status-blocked`: 블로킹됨 (의존성 대기 등)
- `status-needs-review`: 코드 리뷰 대기

### 컴포넌트 라벨
- `component-collection`, `component-tab`, `component-tag`: 기능별 분류
- `component-search`, `component-theme`, `component-ui`: UI 영역별

## 📊 Issue 트래킹 및 프로젝트 관리

### 1. GitHub Projects 연동
- **Phase 보드**: 각 Phase별 진행 상황 칸반
- **Sprint 보드**: 주간 작업 계획 및 진행률
- **Backlog**: 향후 작업 및 아이디어

### 2. Milestone 설정
```
📌 Phase 1 Complete (Week 1)
📌 Phase 2 Complete (Week 2)
📌 Phase 3 Complete (Week 3-4)
...
```

### 3. Issue 템플릿 활용
- **📋 Phase Task**: WBS 기반 개발 작업
- **🐛 Bug Report**: 버그 신고 및 수정
- **✨ Feature Request**: 새로운 기능 제안

## 🔄 자동화 워크플로우

### GitHub Actions 연동
```yaml
# .github/workflows/issue-automation.yml
name: Issue Automation

on:
  issues:
    types: [opened, closed]
  pull_request:
    types: [opened, merged]

jobs:
  update-project:
    runs-on: ubuntu-latest
    steps:
      - name: Update Project Board
        # Issue가 열리면 자동으로 "Todo" 컬럼에 추가
      - name: Label TDD Phase
        # 커밋 메시지 기반으로 TDD 라벨 자동 적용
      - name: Update Progress
        # Phase 완료 시 자동으로 WORK_PROGRESS.md 업데이트
```

## 📋 일일 워크플로우

### 작업 시작 시
1. **GitHub Issues 확인**: 오늘 할 작업 이슈 확인
2. **브랜치 생성**: `feature/issue-{number}-{description}`
3. **Issue 댓글**: "작업 시작" 상태 업데이트

### TDD 사이클 중
1. **Red Phase**: 실패 테스트 커밋 → Issue 댓글 업데이트
2. **Green Phase**: 기본 구현 커밋 → Issue 댓글 업데이트
3. **Refactor Phase**: 개선 커밋 → Issue 댓글 업데이트

### 작업 완료 시
1. **PR 생성**: Issue 자동 연결
2. **리뷰 요청**: 필요시 동료 리뷰
3. **머지 후**: Issue 자동 Close
4. **문서 업데이트**: WORK_PROGRESS.md 반영

## 🎯 품질 관리

### Definition of Done (DoD)
각 Issue는 다음 조건을 모두 만족해야 완료:

- [ ] 모든 테스트 통과 (커버리지 90%+)
- [ ] TypeScript 컴파일 오류 0개
- [ ] ESLint 경고 0개
- [ ] 코드 리뷰 완료
- [ ] PR 템플릿 완전 작성
- [ ] Issue 연결 및 적절한 라벨링
- [ ] 문서 업데이트 (필요시)

### 코드 품질 체크
```bash
# 매 커밋 전 실행
npm run lint      # ESLint 검사
npm run test      # 테스트 실행
npm run build     # 빌드 검증
```

---

이 워크플로우를 통해 **투명하고 추적 가능한 개발 프로세스**를 구축하여, 언제든지 프로젝트 진행 상황을 정확히 파악할 수 있습니다. 🚀