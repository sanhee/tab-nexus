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
   - `git commit -m "test: [feature] 실패 테스트 작성"`
2. **🟢 Green**: Implement minimum code to pass tests
   - `git commit -m "feat: [feature] 기본 구현"`
3. **🔵 Refactor**: Improve code quality while keeping tests green
   - `git commit -m "refactor: [feature] 최적화"`

**Total planned commits: 315 across 105 TDD cycles over 10 phases**

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
```

### Creating Pull Requests
- Use provided PR template in `.github/pull_request_template.md`
- Target `develop` branch, not `main`
- Fill out all checklist items
- Include Korean summary and test results

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