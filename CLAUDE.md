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

## Architecture Overview

### Project Structure
- **Repository root**: Git operations, documentation (`docs/`), templates (`.github/`)
- **`/frontend`**: React application with strict TypeScript and TDD methodology
- **`/docs`**: Critical documentation - always check git log and `WORK_PROGRESS.md` first for current status and `WBS.md`, `PROJECT_SPECIFICATION.md`, `DEVELOPMENT_MISTAKE.md`

### TDD Development Cycle
This project follows **strict Test-Driven Development** with Red-Green-Refactor cycles:

1. **🔴 Red**: Write failing tests in Korean
   - **CRITICAL**: `./scripts/tdd-workflow.sh red` - 검증 스크립트 실행
   - TypeScript 타입 체크: `npx tsc --noEmit`
   - 테스트 실패 확인: `npm test` (실패해야 정상)
   - `git commit -m "🔴 test: [feature] 실패 테스트 작성"`

2. **🟢 Green**: Implement minimum code to pass tests
   - **CRITICAL**: `./scripts/tdd-workflow.sh green` - 검증 스크립트 실행
   - 의존성 확인: `npm ls [package]`
   - 컴파일 확인: `npm run build`
   - 테스트 통과: `npm test`
   - `git commit -m "🟢 feat: [feature] 기본 구현"`

3. **🔵 Refactor**: Improve code quality while keeping tests green
   - **CRITICAL**: `./scripts/tdd-workflow.sh refactor` - 검증 스크립트 실행
   - 품질 검사: `npm run lint && npm run build && npm test`
   - 커버리지 확인: `npm run test:coverage`
   - `git commit -m "🔵 refactor: [feature] 최적화"`

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