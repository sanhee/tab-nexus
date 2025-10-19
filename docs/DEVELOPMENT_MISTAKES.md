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

## 🎯 브랜치 및 Git 관련

### ❌ 실수 5: Git 작업 경로 착각
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

## 📝 체크리스트

### 새로운 기능 개발 전 확인사항
- [ ] 현재 경로가 `/Users/al03176821/sideproject/tab-nexus` 인가?
- [ ] `git status`로 올바른 브랜치에 있는가?
- [ ] npm 작업 시 `frontend/` 디렉토리로 이동했는가?

### 의존성 설치 후 확인사항
- [ ] `frontend/package.json`이 업데이트되었는가?
- [ ] `frontend/node_modules`가 생성되었는가?
- [ ] **상위 디렉토리에 의도치 않은 파일들이 생성되지 않았는가?**

### 커밋 전 확인사항
- [ ] TypeScript 컴파일 오류 없는가? (`npm run build`)
- [ ] 테스트 통과하는가? (`npm test`)
- [ ] 불필요한 파일들이 staging되지 않았는가?

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

## 💡 개발 팁

1. **경로 확인 습관화**: 명령어 실행 전 항상 `pwd` 실행
2. **의존성 설치 패턴**: React 프로젝트는 항상 runtime + types + build tools 세트로 설치
3. **Git 브랜치 전략**: feature → develop → release → main 순서 준수
4. **테스트 우선**: 새로운 설정 후 반드시 `npm test` 또는 `npm run build`로 검증

---

**📍 기억할 것**: 항상 올바른 디렉토리에서 올바른 도구 사용하기!