# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Working Directory Requirements
**CRITICAL:** All npm commands MUST be run from `/frontend` directory:
```bash
cd /Users/al03176821/sideproject/tab-nexus/frontend
npm run dev          # Start dev server
npm test             # Run tests in watch mode
npm run build        # TypeScript check + production build
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format all code
```

**Git operations run from repository root:**
```bash
cd /Users/al03176821/sideproject/tab-nexus
git status
git add .
git commit -m "feat: your changes"
```

### Key Development Commands
- `npm test -- --ui` - Open Vitest UI for interactive testing
- `npm run test:coverage` - Generate coverage reports (target: 90%+)
- `npm test -- src/test/specific.test.ts` - Run single test file
- `git log --oneline -10` - Check recent commits for context

### GitHub MCP Server Integration
**IMPORTANT**: GitHub MCP 서버가 설치되어 있어 GitHub API 직접 사용 가능

#### 필수 사용 시나리오
1. **작업 시작 전**: 항상 관련 GitHub Issue 확인
2. **PR 생성 시**: GitHub MCP로 PR 생성 및 관리
3. **이슈 추적**: 진행 중인 이슈 상태 확인 및 업데이트
4. **코드 리뷰**: Copilot 리뷰 요청 및 응답

#### 주요 MCP 도구 사용법
```bash
# 1. 현재 저장소의 이슈 확인 (Phase별 이슈 추적)
mcp__github__list_issues(owner="sanhee", repo="tab-nexus", state="OPEN")

# 2. 특정 이슈 상세 확인
mcp__github__get_issue(owner="sanhee", repo="tab-nexus", issue_number=N)

# 3. PR 생성 (develop 브랜치로)
mcp__github__create_pull_request(
  owner="sanhee",
  repo="tab-nexus",
  title="[Phase X.Y]: Feature 완료 (TDD)",
  head="feature/branch-name",
  base="develop",
  body="..."
)

# 4. Copilot 코드 리뷰 요청
mcp__github__request_copilot_review(
  owner="sanhee",
  repo="tab-nexus",
  pullNumber=N
)

# 5. PR 리뷰 코멘트 확인
mcp__github__pull_request_read(
  method="get_review_comments",
  owner="sanhee",
  repo="tab-nexus",
  pullNumber=N
)

# 6. 이슈 업데이트 (작업 완료 시)
mcp__github__update_issue(
  owner="sanhee",
  repo="tab-nexus",
  issue_number=N,
  state="closed",
  state_reason="completed"
)
```

#### MCP 사용 원칙
- **작업 시작 시**: 해당 Phase의 이슈 확인 및 상태 파악
- **커밋 전**: 이슈 번호 확인하여 `[#N]` 형식으로 커밋 메시지 작성
- **PR 생성 시**: MCP로 PR 생성 후 Copilot 리뷰 즉시 요청
- **리뷰 피드백 시**: MCP로 상세 코멘트 확인 후 응답
- **작업 완료 시**: 이슈 상태를 "completed"로 업데이트

## Architecture Overview

### Project Structure
- **Repository root**: Git operations, documentation (`docs/`), templates (`.github/`)
- **`/frontend`**: React application with strict TypeScript and TDD methodology
- **`/docs`**: Critical documentation - always check git log and `WORK_PROGRESS.md` first for current status and `WBS.md`, `PROJECT_SPECIFICATION.md`, `DEVELOPMENT_MISTAKE.md`

### TDD Development Cycle with GitHub Issue Integration

**🔥 NEW CONVENTION (Phase 2.2부터 적용)**: 모든 커밋 메시지 앞에 GitHub Issue 번호 포함
```bash
git commit -m "[#이슈번호] 타입: 변경사항"
```

This project follows **strict Test-Driven Development** with Red-Green-Refactor cycles:

1. **🔴 Red**: Write failing tests in Korean
   - **CRITICAL**: `./scripts/tdd-workflow.sh red` - 검증 스크립트 실행
   - TypeScript 타입 체크: `npx tsc --noEmit`
   - 테스트 실패 확인: `npm test` (실패해야 정상)
   - `git commit -m "[#이슈번호] 🔴 test: [feature] 실패 테스트 작성"`

2. **🟢 Green**: Implement minimum code to pass tests
   - **CRITICAL**: `./scripts/tdd-workflow.sh green` - 검증 스크립트 실행
   - 의존성 확인: `npm ls [package]`
   - 컴파일 확인: `npm run build`
   - 테스트 통과: `npm test`
   - `git commit -m "[#이슈번호] 🟢 feat: [feature] 기본 구현"`

3. **🔵 Refactor**: Improve code quality while keeping tests green
   - **CRITICAL**: `./scripts/tdd-workflow.sh refactor` - 검증 스크립트 실행
   - 품질 검사: `npm run lint && npm run build && npm test`
   - 커버리지 확인: `npm run test:coverage`
   - `git commit -m "[#이슈번호] 🔵 refactor: [feature] 최적화"`

### 📋 **커밋 메시지 예시**
```bash
# TDD 사이클 커밋
git commit -m "[#8] 🔴 test: 탭 스토어 CRUD 실패 테스트 작성"
git commit -m "[#8] 🟢 feat: 탭 스토어 기본 CRUD 구현"
git commit -m "[#8] 🔵 refactor: 탭 스토어 성능 최적화 및 캐싱"

# 일반 커밋 (모든 타입에 이슈 번호 포함)
git commit -m "[#8] fix: TypeScript 컴파일 에러 수정"
git commit -m "[#8] docs: API 문서 업데이트"
git commit -m "[#8] chore: 의존성 업데이트"
```

4. **📋 PR**: Create Pull Request for completed feature
   - `git push -u origin feature/[name]`
   - `gh pr create --title "[Phase X.Y]: [Feature Name] 완료 (TDD)" --body "..."`

**Total planned commits: 315 across 105 TDD cycles over 10 phases**
**NEVER FORGET: Always create PR after completing each phase/feature!**

### ⚠️ 필수 검증 프로세스
**모든 단계에서 다음을 반드시 실행:**
1. `./scripts/tdd-workflow.sh [phase]` - 자동 검증
2. **Red Phase**: 테스트 실패 확인 필수
3. **Green Phase**: 컴파일 + 테스트 통과 필수
4. **Refactor Phase**: 품질 + 커버리지 확인 필수

**검증 없이 다음 단계로 진행 금지!**

### Front-End Code Organization
```
frontend/src/
├── types/           # TypeScript interfaces (Collection, Tab, etc.)
├── utils/           # Pure functions with validation pattern
├── test/            # Co-located test files (Korean descriptions)
├── components/      # React components (planned)
├── stores/          # Zustand state management (planned)
└── hooks/           # Custom React hooks (planned)
```

### Path Aliases (configured in tsconfig.json + vite.config.ts)
- `@/` → `src/`
- `@types/` → `src/types/`
- `@utils/` → `src/utils/`
- `@components/` → `src/components/`

## Current Development Status

### Phase Progress (check `docs/WORK_PROGRESS.md` for latest)
- **Phase 1.1** ✅ Complete: Dev environment setup
- **Phase 1.2** ✅ Complete: Basic types & utilities (145 tests passing)
- **Phase 1.3** ⏳ Next: CSS setup & theme system

### Active Branch Pattern
- `release` → `develop` → `feature/[name]`
- Current work typically on `feature/*` branches
- PRs merge to `develop`, not directly to `release`

## Testing Conventions

### Test File Patterns
- Location: `src/test/[category]/[feature].test.ts`
- Descriptions: Korean for business logic clarity
- Framework: Vitest with jsdom environment
- Pattern: AAA (Arrange, Act, Assert)

### Example Test Structure
```typescript
describe('컬렉션 타입 검증', () => {
  test('유효한 컬렉션 객체를 검증할 수 있어야 한다', () => {
    // Arrange
    const validCollection: Collection = { /* ... */ };

    // Act
    const result = validateCollection(validCollection);

    // Assert
    expect(result.isValid).toBe(true);
  });
});
```

### Quality Gates
- All tests must pass before commits
- ESLint clean (no warnings)
- Prettier formatted
- TypeScript strict mode compliance
- 90%+ test coverage target

## Error Detection and Fixing Process

### 🚨 Critical Rule: NEVER Ignore TypeScript Compilation Errors
사용자가 발견하기 전에 모든 에러를 사전에 탐지하고 수정해야 함.

### Error Detection Workflow
1. **실시간 검증**: 각 코드 변경 후 즉시 `npm run build` 실행
2. **에러 분류**: 컴파일 에러를 카테고리별로 분류
3. **체계적 수정**: 에러 타입별 표준 수정 절차 적용
4. **검증 완료**: 모든 에러 수정 후 빌드 성공 확인

### Common TypeScript Error Patterns & Fixes

#### 1. Import/Export Errors
```typescript
// ❌ Error: 'SomeType' is declared but never used
import { SomeType, usedFunction } from './module'

// ✅ Fix: Remove unused imports
import { usedFunction } from './module'

// ❌ Error: Must use type-only import
import { TypeName } from './types'

// ✅ Fix: Use type-only import
import type { TypeName } from './types'
```

#### 2. Interface Property Errors
```typescript
// ❌ Error: Property 'tertiary' is missing
interface Colors {
  primary: string;
  secondary: string;
  // tertiary: string; // Missing!
}

// ✅ Fix: Add missing properties to all implementations
```

#### 3. Unused Variable Errors
```typescript
// ❌ Error: 'unusedVar' is declared but never used
function example() {
  const unusedVar = getValue();
  const usedVar = getOtherValue();
  return usedVar;
}

// ✅ Fix: Remove unused variables
function example() {
  const usedVar = getOtherValue();
  return usedVar;
}
```

### Error Fixing Priority Order
1. **Type Definition Errors**: Fix interface/type mismatches first
2. **Import/Export Errors**: Clean up unused imports
3. **Property Missing Errors**: Add required properties
4. **Unused Variable Errors**: Remove or use variables
5. **Logic Errors**: Fix business logic issues

### Validation Commands
```bash
# 1. TypeScript compilation check
npm run build

# 2. Specific file type check
npx tsc --noEmit --skipLibCheck [filename]

# 3. Test specific file
npm test [test-file-path]

# 4. ESLint check
npm run lint

# 5. Phase-specific validation
./scripts/validate-phase-2-1.sh
```

### Process Improvement Notes
- **Always run build after any code change**
- **Fix errors in systematic order (types → imports → variables)**
- **Use IDE diagnostics to catch errors early**
- **Create focused validation scripts for specific phases**
- **Document error patterns for future reference**

## 🚨 Critical Mistake Prevention Process

### Phase 2.1 실수 분석 및 개선 방안

#### 📋 **발생한 실수들 (Phase 2.1)**

**1. PR 템플릿 미준수 (2회)**
- ❌ 실수: 사용자 템플릿 무시하고 자체 형식 사용
- 🔍 원인: 템플릿 확인 없이 추측으로 작성
- 📝 사용자 피드백: "또 pr템플릿에 맞게 안했네? ㅡㅡ"
- ✅ 개선: **ALWAYS** `.github/pull_request_template.md` 확인 후 작성

**2. GitHub Workflow 권한 문제**
- ❌ 실수: PAT workflow scope 없이 워크플로우 파일 푸시
- 🔍 원인: 권한 검증 없이 자동화 스크립트 추가
- ✅ 개선: 워크플로우 파일 변경 시 권한 사전 확인

**3. Copilot 리뷰 상세 확인 부족**
- ❌ 실수: 구체적 코드 리뷰 코멘트 놓치고 일반 답변
- 🔍 원인: API로 상세 코멘트 확인 없이 추측
- 📝 사용자 피드백: "지금 코멘트 보면 코파일럿이 리뷰남긴거 있어 보고 답변해"
- ✅ 개선: `gh api repos/.../pulls/.../comments` 필수 실행

**4. 하드코딩된 경로 (이식성 문제)**
- ❌ 실수: 절대 경로로 스크립트 작성
- 🔍 원인: 개발 환경 기준으로만 고려
- 🤖 Copilot 지적: "non-portable", "should use relative path"
- ✅ 개선: `$(dirname "$0")` 패턴으로 동적 경로 사용

**5. TypeScript 안전성 우회**
- ❌ 실수: `!` 연산자로 타입 체크 우회
- 🔍 원인: 편의성 우선으로 안전성 간과
- 🤖 Copilot 지적: "bypasses TypeScript's safety checks"
- ✅ 개선: `?? []` 패턴으로 안전한 fallback 사용

### 🔒 **필수 검증 체크리스트**

#### **PR 생성 전 체크리스트**
- [ ] `.github/pull_request_template.md` 내용 확인
- [ ] 하드코딩된 경로 없는지 확인: `grep -r "/Users/" . --exclude-dir=node_modules`
- [ ] TypeScript non-null assertion 검사: `grep -r "\!" src/ --include="*.ts"`
- [ ] 워크플로우 파일 변경 시 PAT workflow scope 확인
- [ ] ESLint 에러 해결: `npm run lint`

#### **코드 리뷰 응답 전 체크리스트**
- [ ] `gh api repos/.../pulls/.../comments` API로 상세 코멘트 확인
- [ ] 각 리뷰 코멘트의 구체적 제안사항 파악
- [ ] 수정사항 테스트 후 응답
- [ ] "Low Confidence" 코멘트도 별도 확인

#### **스크립트 작성 체크리스트**
- [ ] 절대 경로 사용 금지
- [ ] `$(dirname "$0")` 패턴으로 동적 경로 사용
- [ ] 다양한 환경에서 실행 가능한지 확인
- [ ] 환경 변수 fallback 제공: `${VAR:-default}`

### ⚡ **실시간 검증 명령어**

```bash
# 매 커밋 전 필수 명령어
cd /Users/al03176821/sideproject/tab-nexus/frontend
npm run build                 # TypeScript 컴파일 확인
npm test                      # 모든 테스트 통과 확인
cd .. && git status          # 변경사항 확인

# 작업 시작 전 필수 명령어
git fetch origin             # 원격 최신 정보 가져오기
git status                   # 현재 브랜치 상태 확인
git log --oneline -5         # 최근 커밋 이력 확인

# PR 관련 검증
cat .github/pull_request_template.md  # PR 템플릿 확인

# 코드 품질 검사
grep -r "/Users/" . --exclude-dir=node_modules  # 하드코딩 경로 검사
grep -r "\!" src/ --include="*.ts" --include="*.tsx"  # Non-null assertion 검사

# GitHub 관련
gh api repos/owner/repo/pulls/PR_NUM/comments  # Copilot 리뷰 상세 확인

# 스크립트 이식성 테스트
cd /tmp && /path/to/script    # 임시 디렉토리에서 스크립트 테스트

# 브랜치 충돌 예방
git diff origin/develop...HEAD  # develop과의 차이점 확인
```

### 📈 **지속적 개선 원칙**

1. **실수 발생 시 즉시 문서화**: 패턴 분석 및 예방책 수립
2. **자동화 우선**: 체크리스트를 스크립트로 자동화
3. **사용자 피드백 최우선**: "내가 발견하기전에 너가 먼저알아야지"
4. **이식성 고려**: 개발자 환경 의존성 최소화
5. **안전성 우선**: 편의성보다 타입 안전성 우선

### 📋 **Phase 2.1.2 추가 실수 분석**

**6. TypeScript 컴파일 에러 누적 (중대한 실수)**
- ❌ 실수: 20+ TypeScript 에러를 사전에 발견하지 못함
- 🔍 원인: 각 단계에서 `npm run build` 검증 누락
- 📝 사용자 피드백: "이런에러들을 제발 하나도 남기지 말고 무결점으로 유지하고 PR을 올려"
- ✅ 개선: **매 커밋마다** `npm run build` 필수 실행

**7. 브랜치 충돌 대응 미흡**
- ❌ 실수: develop 브랜치 변경사항을 사전에 확인하지 않음
- 🔍 원인: `git fetch origin` 및 충돌 예상 작업 부족
- ✅ 개선: 작업 시작 전 항상 `git fetch origin && git status` 확인

**8. 테스트 타이밍 이슈 (비결정적 테스트)**
- ❌ 실수: 시간 기반 테스트에서 불안정한 결과 발생
- 🔍 원인: `createdAt`과 `updatedAt` 비교 로직 오류
- ✅ 개선: 시간 비교 시 원본 값 저장 후 비교, 충분한 지연 시간(2ms+) 보장

**9. 커밋되지 않은 변경사항 놓침**
- ❌ 실수: 테스트 수정 후 `git status` 확인 누락
- 🔍 원인: 작업 완료 후 최종 상태 검증 부족
- 📝 사용자 발견: "지금 깃에 변경사항 하나 남아있는거 같은데"
- ✅ 개선: 모든 작업 완료 후 `git status` 필수 확인

### 🔒 **Phase 2.1.2 추가 체크리스트**

#### **매 커밋 전 필수 검증**
- [ ] `npm run build` 실행하여 TypeScript 컴파일 성공 확인
- [ ] `npm test` 실행하여 모든 테스트 통과 확인
- [ ] `git status`로 모든 변경사항이 staging되었는지 확인

#### **작업 시작 전 필수 확인**
- [ ] `git fetch origin` 실행
- [ ] `git status` 및 `git log --oneline -5`로 최신 상태 확인
- [ ] 충돌 가능성이 있는 develop 브랜치 변경사항 확인

#### **시간 기반 테스트 작성 시**
- [ ] 원본 시간값을 별도 변수에 저장
- [ ] 비교 전 충분한 지연 시간(2ms+) 보장
- [ ] `await new Promise(resolve => setTimeout(resolve, 2))` 패턴 사용

#### **작업 완료 후 최종 검증**
- [ ] `git status`로 working tree가 clean인지 확인
- [ ] 모든 변경사항이 커밋되었는지 확인
- [ ] `git log --oneline -3`으로 커밋 이력 검토

### 🎯 **다음 Phase 적용사항**

- Phase 2.2부터 위 체크리스트 **강제 적용**
- 실수 발생 시 문서에 **즉시 추가**
- 자동화 스크립트에 검증 로직 **필수 포함**
- **"사용자가 발견하기 전에 Claude가 먼저 알아야 한다"** 원칙 철저히 준수

## Validation Pattern

Most utilities follow a consistent validation pattern:
```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateSomething(input: SomeType): ValidationResult {
  const rules = [
    required<string>('field'),
    stringLength(1, 100, 'field'),
  ];
  return validate(input.field, rules);
}
```

## Key Files to Check

### Before Starting Work
1. **`docs/WORK_PROGRESS.md`** - Current status, next steps, session context
2. **`docs/WBS.md`** - Detailed phase breakdown and commit patterns
3. **Current git branch and recent commits** - Context for ongoing work

### For Understanding Architecture
- **`docs/PROJECT_SPECIFICATION.md`** - Full project vision and requirements
- **`frontend/src/types/index.ts`** - Core data models
- **`frontend/package.json`** - Available scripts and dependencies

## Common Workflows

### Starting New Feature
```bash
# 1. Check current status
cat docs/WORK_PROGRESS.md
git status

# 2. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature

# 3. TDD Red phase
cd frontend
# Write failing tests
npm test
cd .. && git commit -m "test: your-feature 실패 테스트 작성"

# 4. TDD Green phase
cd frontend
# Implement minimum code
npm test
cd .. && git commit -m "feat: your-feature 기본 구현"

# 5. TDD Refactor phase
cd frontend
# Improve code quality
npm run lint:fix && npm run format
npm test
cd .. && git commit -m "refactor: your-feature 최적화"

# 6. Update documentation
# Edit docs/WORK_PROGRESS.md
git add docs/ && git commit -m "docs: your-feature 완료 문서 업데이트"

# 7. Create Pull Request
git push -u origin feature/your-feature
gh pr create --title "[Phase X.Y]: your-feature 완료 (TDD)" --body "..."
```

### Creating Pull Requests
**CRITICAL**: NEVER forget to create PR after completing each phase/feature!

- Use provided PR template in `.github/pull_request_template.md`
- Target `develop` branch, not `main`
- Fill out all checklist items
- Include Korean summary and test results
- **Always create PR immediately after completing feature implementation**

#### Issue 연동 가이드
**PR 생성 시 반드시 포함할 내용:**
1. **완료되는 이슈**: `Closes #123` (PR 머지 시 이슈 자동 Close)
2. **Phase 정보**: Phase X.Y 및 TDD 사이클 단계 명시
3. **연관 이슈**: 참조만 하는 이슈는 `Related to #456`

**자동화된 워크플로우:**
- PR 머지 → 연관 이슈 자동 Close
- 이슈에 완료 댓글 자동 추가
- WORK_PROGRESS.md 자동 업데이트
- 라벨 자동 동기화

## Technology Stack

### Core Dependencies
- **React 19** with TypeScript 5 (strict mode)
- **Vite** for build tooling and dev server
- **Vitest** + React Testing Library for testing
- **Zustand** for state management (planned)
- **ESLint** + **Prettier** for code quality
- **Husky** for Git hooks (pre-commit runs lint + format + test)

### Planned Additions
- `@dnd-kit` for drag-and-drop functionality
- `clsx` for conditional CSS classes
- CSS Modules for styling (matches Toby benchmark)

## Development Principles

### Code Style
- **Korean test descriptions** for business logic clarity
- **TypeScript strict mode** - no `any` types, explicit returns
- **Pure functions** preferred over classes
- **Early returns** for error conditions
- **Immutable data patterns**

### Git Conventions
- **Conventional Commits**: `feat:`, `test:`, `refactor:`, `docs:`, `fix:`
- **Korean commit messages** for feature descriptions
- **One logical change per commit**
- **Update documentation** with every completed feature

### Quality Standards
- 90%+ test coverage minimum
- Zero ESLint warnings
- All TypeScript errors resolved
- Korean documentation updated
- PR template fully completed

## Troubleshooting

### Common Issues
- **npm commands failing**: Ensure you're in `/frontend` directory
- **Tests not running**: Check `src/test/setup.ts` and jsdom config
- **Import errors**: Verify path aliases in both `tsconfig.json` and `vite.config.ts`
- **Husky hooks not working**: Run `npx husky install` from frontend directory

### Recovery Commands
```bash
# Reset npm cache if issues
cd frontend
npm test -- --clearCache

# Fix formatting and linting
npm run lint:fix
npm run format

# Restart TypeScript server in IDE if import errors persist
```

This codebase emphasizes disciplined development through TDD, comprehensive testing, and thorough documentation. Every feature goes through the complete Red-Green-Refactor cycle with Korean business logic tests and English implementation code.