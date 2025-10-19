# tab-nexus - 차세대 웹 탭 관리 도구 개발 기획서

## 1. 프로젝트 개요

### 프로젝트 명
**tab-nexus - Web Tab Management Tool**

### 프로젝트 목적
Toby Tab Manager에서 영감을 받아 더 나은 사용자 경험과 현대적인 기술 스택으로 구현하는 차세대 웹 탭 관리 도구 개발
- 직관적이고 유연한 탭 관리 워크플로우 제공
- TDD 기반의 견고하고 확장 가능한 코드베이스 구축
- TypeScript와 React를 활용한 타입 안전성과 성능 최적화

### 참조 자료
**기준 HTML 구조**: [bechmarking.html](./bechmarking.html)
- Toby의 실제 DOM 구조와 CSS 클래스명 분석
- 컴포넌트별 스타일링 패턴 참조
- 반응형 레이아웃 및 테마 시스템 구조 분석
- 드래그앤드롭 및 모달 구현 방식 참고

### 타겟 사용자
- 다수의 브라우저 탭을 효율적으로 관리하고 싶은 사용자
- 프로젝트별/카테고리별로 탭을 정리하고 싶은 개발자, 연구자, 학생
- 생산성 향상을 원하는 일반 사용자

## 2. 핵심 기능 분석 (원본 Toby 기반)

### 2.1 bechmarking.html 분석 결과

#### 주요 컴포넌트 클래스 구조
- **리스트 컨테이너**: `List__list___1gCrS` - 컬렉션 전체 래퍼
- **카드 컴포넌트**: `Card__card___3bYZf` - 개별 탭 카드
- **헤더 영역**: `List__listTitle___3izPZ` - 컬렉션 제목
- **버튼 그룹**: `List__listHeaderBtns___T4cRS` - 액션 버튼들
- **드래그 핸들**: `List__listBtnMove___1OcuM` - 드래그앤드롭 핸들

#### CSS 변수 기반 테마 시스템
```css
/* 라이트 테마 (기본) */
--card-bg: #f5f5fb;
--text-primary: #3e3e3e;
--text-secondary: #9795ac;

/* 다크 테마 */
--card-bg: #292c35;
--text-primary: #b7b7ce;
--text-secondary: #5e5e64;
```

#### 뷰 모드별 클래스 패턴
- **그리드 뷰**: `List__listCards___PY_Fp`
- **리스트 뷰**: `List__listCardsListView___1EAwi`
- **압축 뷰**: `List__listCardsCondensedView___2kT6f`
- **그리드 압축**: `List__listCardsGridView___3P-4G`

### 2.2 메인 레이아웃 구조
```
┌─────────────────────────────────────────────────┐
│ 상단 헤더 (검색, 설정, 프로필)                  │
├─────────────────────────────────────────────────┤
│ 사이드바 │           메인 콘텐츠               │
│ - 컬렉션 │   ┌─────────────────────────────┐   │
│ - 태그    │   │ 컬렉션 제목 + 정렬/뷰 옵션  │   │
│ - 필터    │   ├─────────────────────────────┤   │
│          │   │     탭 카드들 (그리드뷰)     │   │
│          │   │  ┌───┐ ┌───┐ ┌───┐ ┌───┐  │   │
│          │   │  │tab│ │tab│ │tab│ │tab│  │   │
│          │   │  └───┘ └───┘ └───┘ └───┘  │   │
│          │   └─────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 2.2 주요 컴포넌트별 기능

#### A. 컬렉션 (List) 관리
- **컬렉션 생성/삭제/편집**
- **컬렉션 제목 편집** (인라인 편집)
- **컬렉션 정렬** (드래그 앤 드롭)
- **컬렉션 확장/축소**
- **컬렉션 공유** 기능
- **컬렉션별 탭 카운트** 표시

#### B. 탭 카드 (Card) 관리
- **탭 카드 표시**: 파비콘, 제목, URL 미리보기
- **탭 카드 편집**: 제목, 설명, URL 수정
- **탭 카드 삭제**
- **탭 카드 이동**: 드래그 앤 드롭으로 컬렉션 간 이동
- **노트 카드**: 텍스트만 저장하는 메모 기능
- **탭 카드 정렬**: 수동/자동 정렬 옵션

#### C. 뷰 모드
1. **그리드 뷰** (기본): 카드 형태로 표시
2. **리스트 뷰**: 한 줄로 표시
3. **압축 뷰**: 더 작은 크기로 표시
4. **그리드 압축 뷰**: 그리드 + 압축 조합

#### D. 태그 시스템
- **컬러 태그**: 8가지 색상 (핑크, 블루, 오렌지, 그레이, 퍼플, 옐로우, 그린, 브라운)
- **태그 필터링**
- **태그 생성/편집/삭제**
- **태그별 그룹핑**

#### E. 정렬 시스템
- **수동 정렬** (드래그 앤 드롭)
- **생성일순 정렬**
- **제목순 정렬**
- **URL순 정렬**
- **오름차순/내림차순** 옵션

#### F. 검색 및 필터
- **전체 검색**: 제목, URL, 설명 검색
- **태그별 필터링**
- **컬렉션별 필터링**

#### G. 테마 시스템
- **라이트 테마** (기본)
- **다크 테마**
- CSS 변수를 통한 테마 전환

## 3. 기술 스택 선정

### 3.1 프론트엔드
- **Framework**: React.js 18+ (함수형 컴포넌트, Hooks)
- **언어**: TypeScript 5.0+ (strict 모드)
- **상태관리**: Zustand
- **스타일링**: CSS Modules (기존 Toby 스타일 참조)
- **드래그앤드롭**: @dnd-kit/core
- **아이콘**: React Icons
- **빌드도구**: Vite

### 3.2 테스트 도구 (TDD 개발)
- **테스트 프레임워크**: Jest + Testing Library
- **E2E 테스트**: Playwright
- **컴포넌트 테스트**: React Testing Library
- **모킹**: MSW (Mock Service Worker)
- **커버리지**: Jest Coverage
- **테스트 러너**: Vitest (Vite와 통합)

### 3.3 백엔드 (선택사항)
- **데이터 저장**:
  - 로컬: localStorage 또는 IndexedDB
  - 클라우드: Firebase Firestore (동기화 기능 시)

### 3.4 개발 도구
- **패키지 매니저**: npm
- **코드 포맷팅**: Prettier
- **린터**: ESLint + TypeScript ESLint
- **타입체킹**: TypeScript strict 모드
- **Git Hooks**: Husky + lint-staged

## 4. 데이터 구조 설계

### 4.1 컬렉션 (Collection) 구조
```typescript
interface Collection {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  isExpanded: boolean;
  sortOrder: number;
  viewMode: 'grid' | 'list' | 'condensed' | 'grid-condensed';
  sortType: 'manual' | 'date' | 'title' | 'url';
  sortDirection: 'asc' | 'desc';
  tabs: Tab[];
  tags: string[];
}
```

### 4.2 탭 (Tab) 구조
```typescript
interface Tab {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  type: 'webpage' | 'note';
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  tags: string[];
  collectionId: string;

  // 노트 타입인 경우
  noteContent?: string;
}
```

### 4.3 태그 (Tag) 구조
```typescript
interface Tag {
  id: string;
  name: string;
  color: 'pink' | 'blue' | 'orange' | 'gray' | 'purple' | 'yellow' | 'green' | 'brown';
  createdAt: Date;
  usageCount: number;
}
```

### 4.4 사용자 설정 구조
```typescript
interface UserSettings {
  theme: 'light' | 'dark';
  defaultViewMode: ViewMode;
  defaultSortType: SortType;
  defaultSortDirection: SortDirection;
  sidebarCollapsed: boolean;
  autoSave: boolean;
  syncEnabled: boolean;
}
```

## 5. 컴포넌트 구조 설계

### 5.1 컴포넌트 계층구조
```
App
├── Header
│   ├── SearchBar
│   ├── ThemeToggle
│   └── UserMenu
├── Sidebar
│   ├── CollectionList
│   ├── TagFilter
│   └── ViewOptions
├── MainContent
│   ├── CollectionHeader
│   │   ├── CollectionTitle
│   │   ├── SortOptions
│   │   └── ViewModeToggle
│   └── TabGrid
│       └── TabCard[]
├── Modal
│   ├── EditTabModal
│   ├── EditCollectionModal
│   └── ConfirmDeleteModal
└── DragOverlay
```

### 5.2 주요 컴포넌트별 책임

#### Header 컴포넌트
- 전체 검색 기능
- 테마 토글
- 사용자 메뉴 (설정, 정보)

#### Sidebar 컴포넌트
- 컬렉션 목록 표시/관리
- 태그 필터링
- 뷰 옵션 설정

#### TabCard 컴포넌트
- 탭 정보 표시 (파비콘, 제목, URL)
- 인라인 편집 기능
- 드래그 핸들
- 컨텍스트 메뉴

#### CollectionHeader 컴포넌트
- 컬렉션 제목 편집
- 정렬 옵션
- 뷰 모드 전환
- 컬렉션 액션 버튼들

## 6. TDD 기반 개발 방법론

### 6.1 Red-Green-Refactor 사이클
```
🔴 Red: 실패하는 테스트 작성 (한글로 테스트 케이스 작성)
    ↓
🟢 Green: 테스트를 통과하는 최소한의 코드 작성
    ↓
🔵 Refactor: 코드 품질 개선 (테스트는 계속 통과)
    ↓
반복...
```

### 6.2 테스트 작성 원칙
1. **한글 테스트 케이스**: 비개발자도 이해할 수 있는 명확한 한글 설명
2. **AAA 패턴**: Arrange(준비) - Act(실행) - Assert(검증)
3. **단일 책임**: 하나의 테스트는 하나의 기능만 검증
4. **독립성**: 테스트 간 의존성 없음
5. **반복 가능**: 언제나 동일한 결과

### 6.3 테스트 레벨별 전략
#### 단위 테스트 (Unit Test)
- **대상**: 개별 함수, 컴포넌트, 훅
- **도구**: Vitest + React Testing Library
- **커버리지**: 90% 이상 목표

#### 통합 테스트 (Integration Test)
- **대상**: 컴포넌트 간 상호작용, 상태 관리
- **도구**: React Testing Library + MSW
- **시나리오**: 사용자 워크플로우 기반

#### E2E 테스트 (End-to-End Test)
- **대상**: 전체 애플리케이션 플로우
- **도구**: Playwright
- **범위**: 핵심 사용자 시나리오

### 6.4 Git 커밋 컨벤션 및 워크플로우

#### 커밋 메시지 규칙
모든 작업은 의미 있는 단위로 커밋하며, 다음 형식을 준수합니다:

```
<타입>: [작업 내용]

<상세 설명 (선택사항)>
```

#### 커밋 타입 정의
- **feat**: 새로운 기능 추가
  ```bash
  feat: 컬렉션 생성 기능 구현
  feat: 탭 카드 드래그앤드롭 기능 추가
  ```

- **test**: 테스트 코드 작성 (TDD Red/Green/Refactor)
  ```bash
  test: 컬렉션 CRUD 테스트 케이스 작성
  test: 탭 검색 기능 테스트 추가
  ```

- **refactor**: 코드 리팩토링 (기능 변경 없음)
  ```bash
  refactor: 컬렉션 스토어 로직 최적화
  refactor: 컴포넌트 메모이제이션 적용
  ```

- **style**: 코드 포맷팅, 세미콜론 누락 등
  ```bash
  style: ESLint 규칙 적용
  style: Prettier 포맷팅 적용
  ```

- **fix**: 버그 수정
  ```bash
  fix: 드래그앤드롭 시 상태 동기화 오류 수정
  fix: 다크테마 전환 시 깜빡임 현상 해결
  ```

- **docs**: 문서 수정
  ```bash
  docs: README 사용법 가이드 추가
  docs: 컴포넌트 JSDoc 주석 작성
  ```

- **chore**: 빌드 스크립트, 패키지 매니저 설정 등
  ```bash
  chore: Vite 설정 파일 업데이트
  chore: 의존성 패키지 버전 업그레이드
  ```

#### TDD 기반 커밋 플로우
각 기능 개발 시 다음 순서로 커밋합니다:

1. **🔴 Red Phase 커밋**
   ```bash
   test: 컬렉션 추가 기능 실패 테스트 작성

   - 새 컬렉션을 추가할 수 있다 테스트 케이스
   - 빈 제목으로는 컬렉션을 생성할 수 없다 테스트 케이스
   - 현재 모든 테스트 실패 상태
   ```

2. **🟢 Green Phase 커밋**
   ```bash
   feat: 컬렉션 추가 기능 최소 구현

   - addCollection 함수 기본 구현
   - 테스트 통과를 위한 최소한의 코드
   - 모든 기존 테스트 여전히 통과
   ```

3. **🔵 Refactor Phase 커밋**
   ```bash
   refactor: 컬렉션 추가 로직 개선

   - 중복 코드 제거
   - 에러 핸들링 강화
   - 타입 안전성 개선
   - 모든 테스트 여전히 통과
   ```

#### 브랜치 전략
- **main**: 배포 가능한 안정된 버전
- **develop**: 개발 중인 기능들이 통합되는 브랜치
- **feature/**: 개별 기능 개발 브랜치
  ```bash
  feature/collection-crud
  feature/tab-drag-drop
  feature/search-functionality
  ```

#### 작업 단위별 커밋 예시
**Phase 3.1: 컬렉션 CRUD 개발**
```bash
# 1. 테스트 케이스 작성
test: 컬렉션 생성 실패 테스트 케이스 작성

# 2. 최소 구현
feat: 컬렉션 생성 기본 기능 구현

# 3. 리팩토링
refactor: 컬렉션 생성 로직 타입 안전성 강화

# 4. 다음 기능 테스트
test: 컬렉션 수정 실패 테스트 케이스 작성

# 5. 구현
feat: 컬렉션 수정 기능 구현

# 6. 리팩토링
refactor: 컬렉션 CRUD 공통 로직 추출
```

#### 커밋 메시지 검증
Husky와 commitlint를 통해 커밋 메시지 규칙을 자동 검증:

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'test', 'refactor',
      'style', 'docs', 'chore'
    ]],
    'subject-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72]
  }
}
```

#### 일일 커밋 체크리스트
```markdown
- [ ] 모든 테스트가 통과하는가?
- [ ] 커밋 메시지가 컨벤션을 따르는가?
- [ ] 하나의 커밋이 하나의 논리적 변경사항만 포함하는가?
- [ ] 코드 리뷰를 거쳤는가? (팀 작업 시)
- [ ] 관련 문서가 업데이트되었는가?
```

## 7. 개발 단계별 계획 (TDD 기반)

### Phase 1: 프로젝트 설정 및 기본 구조 (1주)
#### 1.1 개발 환경 설정
- [ ] React + TypeScript + Vite 프로젝트 생성
- [ ] 테스트 도구 설정 (Vitest, RTL, Playwright)
- [ ] ESLint, Prettier, Husky 설정
- [ ] 폴더 구조 및 절대 경로 설정

#### 1.2 기본 타입 및 유틸리티 (TDD)
```typescript
// 예시 테스트 케이스
describe('컬렉션 타입 검증', () => {
  test('새 컬렉션을 생성할 때 필수 필드가 포함되어야 한다', () => {})
  test('컬렉션 ID는 고유해야 한다', () => {})
})
```

### Phase 2: 상태 관리 및 데이터 레이어 (1주)
#### 2.1 Zustand 스토어 (TDD)
```typescript
describe('컬렉션 스토어', () => {
  test('새로운 컬렉션을 추가할 수 있다', () => {})
  test('존재하지 않는 컬렉션을 삭제하려 하면 오류가 발생한다', () => {})
  test('컬렉션 순서를 변경할 수 있다', () => {})
})
```

#### 2.2 로컬 스토리지 연동 (TDD)
```typescript
describe('로컬 스토리지 관리', () => {
  test('데이터를 로컬 스토리지에 저장할 수 있다', () => {})
  test('로컬 스토리지에서 데이터를 불러올 수 있다', () => {})
  test('잘못된 데이터 형식일 때 기본값을 반환한다', () => {})
})
```

### Phase 3: 컬렉션 관리 기능 (1-2주)
#### 3.1 컬렉션 CRUD (TDD)
```typescript
describe('컬렉션 생성 기능', () => {
  test('유효한 제목으로 컬렉션을 생성할 수 있다', () => {})
  test('빈 제목으로는 컬렉션을 생성할 수 없다', () => {})
  test('같은 제목의 컬렉션도 생성할 수 있다', () => {})
})

describe('컬렉션 수정 기능', () => {
  test('컬렉션 제목을 수정할 수 있다', () => {})
  test('존재하지 않는 컬렉션을 수정하려 하면 오류가 발생한다', () => {})
})

describe('컬렉션 삭제 기능', () => {
  test('컬렉션을 삭제할 수 있다', () => {})
  test('컬렉션을 삭제하면 포함된 탭들도 함께 삭제된다', () => {})
})
```

#### 3.2 컬렉션 컴포넌트 (TDD)
```typescript
describe('컬렉션 헤더 컴포넌트', () => {
  test('컬렉션 제목이 표시된다', () => {})
  test('컬렉션 제목을 클릭하면 편집 모드가 된다', () => {})
  test('ESC 키를 누르면 편집이 취소된다', () => {})
  test('Enter 키를 누르면 편집이 저장된다', () => {})
})
```

### Phase 4: 탭 관리 기능 (2주)
#### 4.1 탭 CRUD (TDD)
```typescript
describe('탭 추가 기능', () => {
  test('유효한 URL로 탭을 추가할 수 있다', () => {})
  test('잘못된 URL 형식일 때 오류 메시지가 표시된다', () => {})
  test('노트 타입 탭을 추가할 수 있다', () => {})
})

describe('탭 편집 기능', () => {
  test('탭 제목을 수정할 수 있다', () => {})
  test('탭 설명을 수정할 수 있다', () => {})
  test('탭 URL을 수정할 수 있다', () => {})
})
```

#### 4.2 탭 카드 컴포넌트 (TDD)
```typescript
describe('탭 카드 컴포넌트', () => {
  test('탭 제목과 URL이 표시된다', () => {})
  test('파비콘이 로드되지 않으면 기본 아이콘이 표시된다', () => {})
  test('긴 제목은 말줄임표로 처리된다', () => {})
  test('편집 버튼을 클릭하면 편집 모달이 열린다', () => {})
})
```

### Phase 5: 드래그앤드롭 기능 (1주)
#### 5.1 드래그앤드롭 로직 (TDD)
```typescript
describe('탭 카드 드래그앤드롭', () => {
  test('같은 컬렉션 내에서 탭 순서를 변경할 수 있다', () => {})
  test('다른 컬렉션으로 탭을 이동할 수 있다', () => {})
  test('드래그 중에는 시각적 피드백이 제공된다', () => {})
})

describe('컬렉션 드래그앤드롭', () => {
  test('컬렉션 순서를 변경할 수 있다', () => {})
  test('드래그 중에는 다른 컬렉션이 비활성화된다', () => {})
})
```

### Phase 6: 뷰 모드 및 정렬 (1주)
#### 6.1 뷰 모드 전환 (TDD)
```typescript
describe('뷰 모드 전환', () => {
  test('그리드 뷰에서 리스트 뷰로 전환할 수 있다', () => {})
  test('뷰 모드 변경이 로컬 스토리지에 저장된다', () => {})
  test('각 뷰 모드에서 탭들이 올바르게 표시된다', () => {})
})
```

#### 6.2 정렬 기능 (TDD)
```typescript
describe('탭 정렬 기능', () => {
  test('제목순으로 탭을 정렬할 수 있다', () => {})
  test('생성일순으로 탭을 정렬할 수 있다', () => {})
  test('정렬 순서를 오름차순/내림차순으로 변경할 수 있다', () => {})
})
```

### Phase 7: 태그 시스템 (1주)
#### 7.1 태그 관리 (TDD)
```typescript
describe('태그 생성 기능', () => {
  test('새로운 태그를 생성할 수 있다', () => {})
  test('중복된 태그명으로는 생성할 수 없다', () => {})
  test('태그에 색상을 지정할 수 있다', () => {})
})

describe('태그 필터링', () => {
  test('특정 태그로 탭을 필터링할 수 있다', () => {})
  test('여러 태그로 동시에 필터링할 수 있다', () => {})
  test('태그가 없는 탭들도 필터링할 수 있다', () => {})
})
```

### Phase 8: 검색 기능 (1주)
#### 8.1 검색 엔진 (TDD)
```typescript
describe('검색 기능', () => {
  test('탭 제목으로 검색할 수 있다', () => {})
  test('URL로 검색할 수 있다', () => {})
  test('설명 내용으로 검색할 수 있다', () => {})
  test('대소문자를 구분하지 않고 검색된다', () => {})
  test('부분 문자열로 검색할 수 있다', () => {})
})

describe('검색 결과 표시', () => {
  test('검색 결과에서 일치하는 부분이 하이라이트된다', () => {})
  test('검색 결과가 없으면 안내 메시지가 표시된다', () => {})
})
```

### Phase 9: 테마 시스템 (0.5주)
#### 9.1 테마 전환 (TDD)
```typescript
describe('테마 시스템', () => {
  test('라이트 테마에서 다크 테마로 전환할 수 있다', () => {})
  test('테마 설정이 로컬 스토리지에 저장된다', () => {})
  test('페이지 새로고침 후에도 테마 설정이 유지된다', () => {})
})
```

### Phase 10: E2E 테스트 및 최적화 (1주)
#### 10.1 E2E 시나리오 (TDD)
```typescript
describe('사용자 워크플로우', () => {
  test('새 사용자가 첫 컬렉션을 만들고 탭을 추가할 수 있다', () => {})
  test('기존 사용자가 탭을 다른 컬렉션으로 이동할 수 있다', () => {})
  test('사용자가 태그로 탭을 필터링하고 검색할 수 있다', () => {})
})
```

## 8. 폴더 구조 (TDD 기반)

```
src/
├── components/
│   ├── common/           # 공통 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   ├── collection/      # 컬렉션 관련
│   ├── tab/            # 탭 관련
│   ├── tag/            # 태그 관련
│   └── modal/          # 모달 컴포넌트
├── hooks/              # 커스텀 훅
├── stores/             # 상태 관리 (Zustand)
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── styles/             # 전역 스타일, 테마
├── constants/          # 상수 정의
├── assets/             # 이미지, 아이콘
├── __tests__/          # 테스트 파일
│   ├── unit/           # 단위 테스트
│   ├── integration/    # 통합 테스트
│   ├── e2e/           # E2E 테스트
│   └── fixtures/      # 테스트 데이터
└── __mocks__/          # 모킹 파일
```

## 8. 주요 구현 고려사항

### 8.1 성능 최적화
- **가상화**: 많은 탭 카드 처리시 react-window 사용
- **메모이제이션**: React.memo, useMemo, useCallback 적극 활용
- **지연 로딩**: 이미지 lazy loading
- **번들 분할**: 코드 스플리팅으로 초기 로딩 최적화

### 8.2 HTML 구조 기준 (bechmarking.html 참조)
- **CSS 클래스명 규칙**: BEM 방식의 모듈화된 CSS 클래스 구조
  - 예: `List__list___1gCrS`, `Card__card___3bYZf`
- **컴포넌트 구조**: 실제 Toby의 DOM 트리를 참조한 컴포넌트 설계
- **스타일 시스템**: CSS-in-JS 대신 CSS Modules로 기존 스타일 재현
- **반응형 브레이크포인트**: 기존 Toby의 미디어쿼리 패턴 적용

### 8.3 접근성 (A11y)
- **키보드 네비게이션**: Tab, Enter, Esc 키 지원
- **ARIA 레이블**: 스크린 리더 지원
- **포커스 관리**: 모달, 드롭다운 포커스 트랩
- **색상 대비**: WCAG 가이드라인 준수

### 8.4 반응형 디자인
- **모바일 대응**: 768px 이하에서 사이드바 오버레이
- **태블릿 최적화**: 1024px 이하에서 레이아웃 조정
- **터치 인터페이스**: 모바일에서 드래그앤드롭 대응

### 8.5 데이터 관리
- **자동 저장**: 변경사항 실시간 localStorage 저장
- **백업/복원**: JSON 내보내기/가져오기
- **마이그레이션**: 스키마 변경시 데이터 마이그레이션

## 9. 추가 확장 기능 (Optional)

### 9.1 브라우저 확장 프로그램 연동
- Chrome Extension API 활용
- 현재 열린 탭 감지 및 추가
- 탭 그룹 동기화

### 9.2 클라우드 동기화
- Firebase Authentication
- Firestore를 통한 다기기 동기화
- 오프라인 지원 (PWA)

### 9.3 고급 기능
- 탭 미리보기 스크린샷
- 탭 방문 기록 추적
- 자동 중복 탭 감지 및 제거
- 스마트 카테고리 추천

## 10. 개발 환경 설정

### 10.1 필수 의존성
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.0",
    "zustand": "^4.4.0",
    "react-icons": "^4.11.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "vite": "^4.4.0",
    "@vitejs/plugin-react": "^4.1.0",
    "vitest": "^0.34.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^22.1.0",
    "playwright": "^1.38.0",
    "msw": "^1.3.0",
    "eslint": "^8.48.0",
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^14.0.0"
  }
}
```

### 10.2 개발 스크립트
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,css,md}",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```

### 10.3 테스트 설정 파일
#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ]
    }
  }
})
```
```

## 11. 성공 지표

### 11.1 기능적 지표
- ✅ 컬렉션 생성/편집/삭제 기능 완성도
- ✅ 탭 카드 CRUD 및 드래그앤드롭 동작
- ✅ 4가지 뷰 모드 정상 동작
- ✅ 태그 시스템 완전 구현
- ✅ 검색 및 필터링 정확도

### 11.2 성능 지표
- 🎯 첫 페이지 로딩: 3초 이내
- 🎯 탭 카드 렌더링: 100ms 이내
- 🎯 드래그앤드롭 반응성: 16ms (60fps)
- 🎯 검색 응답시간: 200ms 이내

### 11.3 사용성 지표
- 🎯 모바일 반응형 지원
- 🎯 키보드 네비게이션 완전 지원
- 🎯 다크 테마 완전 지원
- 🎯 데이터 손실 없는 자동 저장

---

## 📋 결론

이 프로젝트는 Toby의 핵심 기능을 분석하여 현대적인 웹 기술 스택으로 재구현하는 것을 목표로 합니다. 단계별 개발 계획을 통해 점진적으로 기능을 구현하며, 성능과 사용성을 모두 고려한 완성도 높은 탭 관리 도구를 개발할 예정입니다.

**예상 개발 기간**: 총 10주 (70일)
**주요 기술**: React 18 + TypeScript 5 + Zustand + @dnd-kit + Vitest
**개발방법론**: TDD (Test-Driven Development)
**배포 목표**: Vercel을 통한 웹 앱 배포

## 🚀 TabFlow의 차별화 포인트

### Toby 대비 기술적 개선사항
1. **현대적 기술 스택**: React 18의 최신 기능 활용
2. **타입 안전성**: TypeScript strict 모드로 런타임 에러 최소화
3. **테스트 기반 개발**: 90% 이상 코드 커버리지로 안정성 보장
4. **성능 최적화**: 가상화와 메모이제이션으로 대용량 데이터 처리
5. **접근성 준수**: WCAG 2.1 AA 기준 완전 준수
6. **반응형 지원**: 모바일부터 데스크톱까지 완벽한 반응형

### 사용자 피드백 기반 UI/UX 개선사항

#### 🔍 검색 및 필터링 강화
**기존 Toby의 한계점**:
- 검색 결과가 하이라이트되지 않음
- 복합 검색 (태그 + 키워드) 어려움
- 검색 히스토리 미지원

**TabFlow 개선안**:
```typescript
// 고급 검색 기능 테스트 케이스
describe('고급 검색 기능', () => {
  test('검색어와 태그를 동시에 필터링할 수 있다', () => {
    // 검색: "리액트" + 태그: "개발"
  })

  test('검색 히스토리를 저장하고 빠른 재검색을 지원한다', () => {
    // 최근 검색어 자동완성
  })

  test('정규표현식 검색을 지원한다', () => {
    // 고급 사용자를 위한 정규표현식 검색
  })
})
```

#### 📱 모바일 사용성 대폭 개선
**기존 Toby의 한계점**:
- 모바일에서 드래그앤드롭이 어려움
- 터치 제스처 미지원
- 모바일 UI가 데스크톱의 축소판

**TabFlow 개선안**:
- **스와이프 제스처**: 좌우 스와이프로 탭 삭제/이동
- **롱프레스 메뉴**: 터치 길게 눌러서 컨텍스트 메뉴
- **플로팅 액션 버튼**: 모바일 전용 빠른 추가 버튼
- **햅틱 피드백**: 터치 액션에 대한 촉각 피드백

#### 🎯 생산성 도구 통합
**사용자 요청 사항**:
- 포모도로 타이머 연동
- 일일/주간 사용 통계
- 탭 사용 패턴 분석

**TabFlow 개선안**:
```typescript
interface ProductivityFeatures {
  // 포모도로 세션 중 방해 요소 차단
  focusMode: {
    enabled: boolean;
    blockedSites: string[];
    sessionDuration: number; // 25분
  }

  // 사용 통계 및 인사이트
  analytics: {
    dailyTabUsage: TabUsageStats[];
    mostVisitedSites: SiteStats[];
    productivityScore: number;
  }

  // 스마트 추천
  recommendations: {
    suggestedTags: string[];
    relatedTabs: Tab[];
    cleanupSuggestions: Tab[];
  }
}
```

#### 🔄 동기화 및 백업 강화
**기존 Toby의 한계점**:
- 기기 간 동기화 불안정
- 백업/복원 기능 부족
- 데이터 손실 위험

**TabFlow 개선안**:
- **실시간 동기화**: Firebase 기반 멀티디바이스 실시간 동기화
- **자동 백업**: 일일 자동 백업 + 클라우드 스토리지 연동
- **버전 관리**: Git 스타일의 변경사항 추적
- **충돌 해결**: 동시 편집 시 스마트 병합 알고리즘

#### 🎨 UI/UX 혁신
**사용자 피드백 기반 개선**:

1. **다이나믹 테마**
   ```css
   /* 시간대별 자동 테마 전환 */
   .theme-auto {
     --primary-color: var(--time-based-color);
     transition: all 0.3s ease;
   }
   ```

2. **컬렉션 미리보기**
   - 호버 시 컬렉션 내부 탭들 미리보기
   - 아코디언 스타일 확장/축소 애니메이션

3. **스마트 레이아웃**
   ```typescript
   describe('적응형 레이아웃', () => {
     test('탭 개수에 따라 최적 그리드 크기를 자동 조정한다', () => {
       // 1-5개: 1열, 6-12개: 2열, 13+개: 3열
     })
   })
   ```

4. **사용자 정의 단축키**
   ```typescript
   interface KeyboardShortcuts {
     quickAdd: string; // 기본값: 'Ctrl+T'
     search: string;   // 기본값: 'Ctrl+F'
     newCollection: string; // 기본값: 'Ctrl+N'
   }
   ```

#### 🔗 브라우저 확장 기능 강화
**TabFlow Browser Extension 계획**:

```typescript
// 브라우저 확장 기능 테스트
describe('브라우저 확장 기능', () => {
  test('현재 열린 모든 탭을 한번에 저장할 수 있다', () => {
    // 원클릭 탭 세션 저장
  })

  test('중복 탭을 자동으로 감지하고 병합을 제안한다', () => {
    // 스마트 중복 탭 관리
  })

  test('탭 그룹을 TabFlow 컬렉션과 동기화한다', () => {
    // Chrome 탭 그룹 ↔ TabFlow 컬렉션 양방향 동기화
  })
})
```

#### 📊 데이터 분석 및 인사이트
**새로운 기능**:

1. **사용 패턴 분석**
   - 가장 자주 사용하는 사이트 TOP 10
   - 시간대별 사용 패턴
   - 생산성 사이트 vs 오락 사이트 비율

2. **스마트 정리 제안**
   ```typescript
   describe('스마트 정리 기능', () => {
     test('30일 이상 사용하지 않은 탭들을 정리 제안한다', () => {
       // 자동 아카이브 제안
     })

     test('비슷한 주제의 탭들을 그룹화 제안한다', () => {
       // AI 기반 자동 카테고라이징
     })
   })
   ```

3. **목표 설정 및 추적**
   - 일일 탭 사용 목표 설정
   - 디지털 웰빙 대시보드
   - 집중 시간 추적

#### 🌐 팀 협업 기능
**기업/팀 사용자를 위한 기능**:

```typescript
interface TeamFeatures {
  // 팀 워크스페이스
  workspace: {
    members: TeamMember[];
    sharedCollections: Collection[];
    permissions: PermissionSettings;
  }

  // 협업 도구
  collaboration: {
    comments: Comment[];
    mentions: Mention[];
    activityFeed: Activity[];
  }
}

describe('팀 협업 기능', () => {
  test('팀원과 컬렉션을 공유할 수 있다', () => {
    // 읽기 전용/편집 가능 권한 설정
  })

  test('팀 내 추천 탭을 공유할 수 있다', () => {
    // "이 사이트 추천해요" 기능
  })
})
```

#### 🎮 게이미피케이션 요소
**사용자 참여도 향상**:

```typescript
interface GamificationFeatures {
  achievements: {
    organizer: 'Master Organizer', // 100개 컬렉션 생성
    curator: 'Content Curator',   // 500개 탭 정리
    explorer: 'Web Explorer'      // 1000개 사이트 방문
  }

  levels: {
    current: number;
    experience: number;
    nextLevelExp: number;
  }

  streaks: {
    dailyOrganization: number; // 연속 정리 일수
    focusTime: number;         // 연속 집중 시간
  }
}
```

#### ♿ 접근성 혁신
**장애인 사용자를 위한 특별 기능**:

```typescript
describe('접근성 혁신 기능', () => {
  test('음성 명령으로 탭을 검색하고 열 수 있다', () => {
    // "구글 열어줘", "리액트 문서 찾아줘"
  })

  test('스크린 리더를 위한 상세한 탭 설명을 제공한다', () => {
    // "구글, 검색엔진, 업무 태그, 3시간 전 추가됨"
  })

  test('고대비 모드와 큰 글씨 모드를 지원한다', () => {
    // WCAG AAA 기준 준수
  })
})
```

### 🎯 Phase별 혁신 기능 개발 계획

이러한 개선사항들을 기존 10개 Phase에 추가로 통합:

- **Phase 11**: 모바일 최적화 및 PWA (1주)
- **Phase 12**: 브라우저 확장 기능 (1주)
- **Phase 13**: 분석 및 인사이트 (1주)
- **Phase 14**: 협업 및 공유 기능 (1주)
- **Phase 15**: 접근성 및 국제화 (1주)

**총 개발 기간**: 15주 → 20주 (확장 기능 포함)

이러한 혁신적인 개선사항들을 통해 TabFlow는 단순한 Toby 클론을 넘어서 차세대 탭 관리의 새로운 표준이 될 것입니다.