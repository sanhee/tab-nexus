# 🚨 개발 실수 방지 가이드

## 📁 디렉토리 구조 관련 실수

### ❌ 실수 1: 잘못된 npm 작업 경로
**문제**: `sideproject/` 또는 `tab-nexus/` 경로에서 npm 명령어 실행
**결과**:
- `sideproject/.npm-cache` 생성
- `sideproject/node_modules` 생성
- `sideproject/package.json` 생성

**✅ 올바른 방법**:
```bash
# 항상 frontend 디렉토리에서 npm 작업
cd /Users/al03176821/sideproject/tab-nexus/frontend
npm install
npm test
npm run dev
```

**💡 확인 방법**:
```bash
pwd  # 현재 위치 확인
# 출력이 /Users/al03176821/sideproject/tab-nexus/frontend 이어야 함
```

### ❌ 실수 2: 중복 디렉토리 생성
**문제**: `tab-nexus/frontend/frontend/` 형태의 중첩 구조 생성
**원인**: 명령어 실행 위치 착각

**✅ 올바른 구조**:
```
sideproject/
└── tab-nexus/
    ├── .git/
    ├── docs/
    └── frontend/
        ├── src/
        ├── node_modules/
        └── package.json
```

## 🔧 의존성 설치 관련 실수

### ❌ 실수 3: 필수 React 타입 정의 누락
**문제**: TypeScript 프로젝트에서 React 타입 정의 미설치
**증상**:
- `Cannot find declaration file for module 'react'`
- `JSX element implicitly has type 'any'`

**✅ 필수 의존성 세트**:
```bash
# Runtime dependencies
npm install react react-dom

# Type definitions
npm install -D @types/react @types/react-dom @types/node

# Build tools
npm install -D typescript @vitejs/plugin-react
```

### ❌ 실수 4: 테스트 환경 설정 불완전
**문제**: Vitest 설정 시 필수 파일 누락
**필수 파일들**:
- `vitest.config.ts`
- `src/test/setup.ts`
- 기본 React 컴포넌트 (`App.tsx`, `main.tsx`)

### ❌ 실수 5: npm cache 경로 설정 오류
**문제**: npm cache가 잘못된 경로에 설정되어 중복 디렉토리 자동 생성
**증상**: npm 명령 실행할 때마다 `frontend/` 디렉토리가 중복 생성됨
**원인**: `npm config get cache`가 `/Users/al03176821/sideproject/frontend/.npm-cache`로 설정됨

**✅ 해결 방법**:
```bash
# 올바른 npm cache 경로 설정
npm config set cache "/Users/al03176821/sideproject/tab-nexus/frontend/.npm-cache"

# 설정 확인
npm config get cache
# 출력: /Users/al03176821/sideproject/tab-nexus/frontend/.npm-cache
```

### ❌ 실수 6: Vite 설정 파일 오류
**문제**: `vite.config.ts`에서 잘못된 플러그인 또는 의존성 참조
**일반적인 오류들**:
- `@vitejs/plugin-react-swc` 대신 `@vitejs/plugin-react` 사용해야 함
- `index.html`에서 `main.ts` 대신 `main.tsx` 참조해야 함
- `div id="app"` 대신 `div id="root"` 사용해야 함

**✅ 올바른 설정**:
```typescript
// vite.config.ts
import react from '@vitejs/plugin-react'  // -swc 아님!

// index.html
<div id="root"></div>  // "app" 아님!
<script type="module" src="/src/main.tsx"></script>  // .ts 아님!
```

## 🎯 브랜치 및 Git 관련

### ❌ 실수 7: Git 작업 경로 착각
**문제**: `.git`이 없는 디렉토리에서 git 명령어 실행
**해결**: 항상 `tab-nexus/` 디렉토리에서 git 작업

**✅ 올바른 Git 작업 플로우**:
```bash
cd /Users/al03176821/sideproject/tab-nexus  # Git 저장소 위치
git checkout develop
git checkout -b feature/branch-name
# 작업 수행 (frontend/ 에서 npm 작업)
cd frontend && npm install  # npm 작업은 frontend에서
cd ..  # git 작업을 위해 tab-nexus로 복귀
git add .
git commit -m "commit message"
git push origin feature/branch-name
```

### ❌ 실수 8: .gitignore 설정 누락으로 불필요 파일 커밋
**문제**: `.npm-cache`, `coverage`, 테스트 스냅샷 파일 등이 Git에 포함됨
**위험**: 저장소 크기 증가, 불필요한 충돌 발생

**✅ 필수 .gitignore 항목**:
```bash
# Dependencies
.npm-cache
npm-cache

# Coverage directory
coverage
*.lcov

# Test snapshots
*.test.js.snap
*.test.ts.snap
*.test.tsx.snap

# Environment variables
.env*
```

### ❌ 실수 9: GitHub CLI 로그인 계정 혼동
**문제**: 여러 GitHub 계정 (회사/개인) 로그인 시 잘못된 계정으로 PR 생성
**확인 방법**:
```bash
# 모든 로그인 계정 확인
gh auth status

# 특정 호스트 확인
gh auth status --hostname github.com

# 원격 저장소 확인
git remote -v
```

**✅ 안전한 PR 생성 플로우**:
1. 현재 로그인 계정 확인
2. 원격 저장소 URL 확인
3. 브랜치 푸시 후 GitHub에서 올바른 저장소에 생성되었는지 확인

## 📝 체크리스트

### 새로운 기능 개발 전 확인사항
- [ ] 현재 경로가 `/Users/al03176821/sideproject/tab-nexus` 인가?
- [ ] `git status`로 올바른 브랜치에 있는가?
- [ ] npm 작업 시 `frontend/` 디렉토리로 이동했는가?
- [ ] npm cache 경로가 올바르게 설정되어 있는가? (`npm config get cache`)

### 의존성 설치 후 확인사항
- [ ] `frontend/package.json`이 업데이트되었는가?
- [ ] `frontend/node_modules`가 생성되었는가?
- [ ] **상위 디렉토리에 의도치 않은 파일들이 생성되지 않았는가?**
- [ ] React 타입 정의가 설치되었는가? (`@types/react`, `@types/react-dom`)

### 커밋 전 확인사항
- [ ] TypeScript 컴파일 오류 없는가? (`npm run build`)
- [ ] 테스트 통과하는가? (`npm test`)
- [ ] 불필요한 파일들이 staging되지 않았는가? (`.npm-cache`, `coverage` 등)
- [ ] .gitignore가 적절히 설정되어 있는가?

### PR 생성 전 확인사항
- [ ] GitHub CLI가 올바른 계정으로 로그인되어 있는가? (`gh auth status`)
- [ ] 원격 저장소 URL이 올바른가? (`git remote -v`)
- [ ] feature 브랜치가 develop에서 분기했는가?

## 🔄 복구 명령어

### 잘못 생성된 파일들 정리
```bash
# sideproject 디렉토리에서 실행
cd /Users/al03176821/sideproject
rm -rf .npm-cache node_modules package.json package-lock.json

# npm cache 경로 재설정
cd tab-nexus
npm config set cache ./frontend/.npm-cache
```

### 중복 디렉토리 제거
```bash
cd /Users/al03176821/sideproject/tab-nexus
find . -name "frontend" -type d  # 중복 확인
rm -rf frontend/frontend/  # 중첩된 것 제거
```

### Git staging 영역에서 불필요 파일 제거
```bash
# 특정 디렉토리 unstage
git reset HEAD -- frontend/.npm-cache/

# 모든 변경사항 unstage
git reset HEAD

# .gitignore 적용 후 이미 추적된 파일 제거
git rm -r --cached frontend/.npm-cache/
git commit -m "Remove cached files from git tracking"
```

### npm 관련 문제 해결
```bash
# npm cache 완전 정리
npm cache clean --force

# node_modules 재설치
cd frontend
rm -rf node_modules package-lock.json
npm install

# npm cache 경로 재설정
npm config set cache "/Users/al03176821/sideproject/tab-nexus/frontend/.npm-cache"
```

## 💡 개발 팁

1. **경로 확인 습관화**: 명령어 실행 전 항상 `pwd` 실행
2. **의존성 설치 패턴**: React 프로젝트는 항상 runtime + types + build tools 세트로 설치
3. **Git 브랜치 전략**: feature → develop → release → main 순서 준수
4. **테스트 우선**: 새로운 설정 후 반드시 `npm test` 또는 `npm run build`로 검증
5. **npm 설정 검증**: `npm config get cache` 주기적 확인
6. **Git 상태 모니터링**: 커밋 전 `git status --porcelain`로 간결한 상태 확인
7. **Multi-account 관리**: GitHub CLI 사용 시 계정 확인 필수
8. **절대 경로 사용**: 상대 경로보다는 절대 경로 사용으로 실수 방지

## 🎯 작업 완료 후 점검사항

### Phase 완료 후 체크리스트
- [ ] 모든 테스트가 통과하는가?
- [ ] 빌드가 성공하는가?
- [ ] 불필요한 파일이 커밋되지 않았는가?
- [ ] PR이 올바른 베이스 브랜치(develop)로 생성되었는가?
- [ ] 커밋 메시지가 컨벤션을 따르는가?

### 세션 종료 전 정리
- [ ] 중복 디렉토리가 남아있지 않은가?
- [ ] npm cache 경로가 올바르게 설정되어 있는가?
- [ ] 작업 브랜치가 원격에 푸시되었는가?
- [ ] 다음 세션을 위한 문서가 업데이트되었는가?

---

**📍 기억할 것**: 항상 올바른 디렉토리에서 올바른 도구 사용하기!
**🚨 경고**: npm 명령 실행 전 반드시 `pwd`로 현재 위치 확인!