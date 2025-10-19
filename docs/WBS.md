# tab-nexus - Work Breakdown Structure (WBS)

## 🎯 프로젝트 개요
**프로젝트명**: tab-nexus - Web Tab Management Tool
**기간**: 10주 (70일)
**개발방법론**: TDD (Test-Driven Development)
**언어**: TypeScript + React
**테스트**: 한글로 작성된 테스트 케이스

---

## 📋 WBS 구성

### 1️⃣ Phase 1: 프로젝트 설정 및 기본 구조 (1주 / 5일) - 🟡 **진행 중** (75% 완료)

#### 1.1 개발 환경 설정 - ✅ **완료**
**소요시간**: 2일
**담당자**: 개발자
**완료 조건**: 모든 설정 파일이 올바르게 동작하고 첫 테스트가 통과해야 함 ✅

- **1.1.1 프로젝트 초기 설정** ✅ (0.5일)
  **커밋 단위 작업**:
  1. `feat: Tab-Nexus 프로젝트 초기 설정` ✅
     - [x] `npm create vite@latest` 실행
     - [x] 기본 의존성 설치
     - [x] 첫 빌드 테스트

  2. `chore: 프로젝트 폴더 구조 및 설정 파일 생성` ✅
     - [x] 기본 폴더 구조 생성 (`src/components`, `src/types`, etc.)
     - [x] `.gitignore` 설정
     - [x] `README.md` 초기 작성

  3. `chore: 개발 서버 실행 및 기본 동작 검증` ✅
     - [x] `npm run dev` 정상 실행 확인
     - [x] 브라우저에서 기본 페이지 확인
     - **검증**: `npm run dev` 실행 시 기본 페이지가 표시됨 ✅

- **1.1.2 테스트 도구 설정** ✅ (1일)
  **커밋 단위 작업**:
  1. `chore: Vitest 및 React Testing Library 테스트 환경 설정` ✅
     - [x] Vitest 의존성 설치
     - [x] `vitest.config.ts` 설정
     - [x] React Testing Library, Jest DOM 설치
     - [x] 첫 번째 테스트 파일 생성 및 실행

  2. `docs: 개발 실수 방지 가이드 보완` ✅
     - [x] npm cache 이슈 해결 방법 문서화
     - [x] Vite asset import 문제 해결 가이드
     - [x] Git workflow 모범 사례 추가

  3. `fix: Vite에서 올바른 asset import 방식으로 React 로고 경로 수정` ✅
     - [x] ES module import 방식으로 변경
     - [x] Copilot 리뷰 피드백 반영

  4. `test: 기본 테스트 케이스 작성 및 검증` ✅
     - [x] 컴포넌트 렌더링 테스트 (한글)
     - [x] React 로고 표시 테스트
     - **검증**: `npm test` 실행 시 모든 테스트가 통과됨 ✅

- **1.1.3 코드 품질 도구 설정** ✅ **완료** (0.5일)
  **커밋 단위 작업**: ✅ `1433aa2: chore: ESLint, Prettier, Husky 코드 품질 도구 설정`
  1. ✅ `chore: ESLint TypeScript 규칙 설정`
     - ✅ ESLint, TypeScript ESLint 설치
     - ✅ `eslint.config.js` 규칙 구성
     - ✅ React, Hooks 규칙 추가

  2. ✅ `chore: Prettier 코드 포맷터 설정`
     - ✅ Prettier 설치 및 설정
     - ✅ `.prettierrc` 규칙 정의
     - ✅ ESLint와 Prettier 충돌 해결

  3. ✅ `chore: Husky Git hooks 및 commitlint 설정`
     - ✅ Husky, lint-staged 설치
     - ✅ pre-commit hook 설정
     - ✅ `.commitlintrc.js` 규칙 구성
     - ✅ 커밋 메시지 컨벤션 강제

  4. ✅ `chore: 코드 품질 도구 통합 검증`
     - ✅ 테스트 코드로 lint 규칙 확인
     - ✅ Git commit 시 자동 검사 확인
     - **검증**: Git commit 시 lint와 format이 자동 실행됨 ✅

#### 1.2 기본 타입 정의 및 유틸리티 (TDD) - 🟡 **진행 중** (50% 완료)
**소요시간**: 2일
**완료 조건**: 모든 기본 타입에 대한 테스트가 통과해야 함
**현재 상태**: Phase 1.2.1 완료, Phase 1.2.2 진행 예정

- **1.2.1 데이터 모델 타입 정의** (1일)
  ```typescript
  // 테스트 케이스 예시
  describe('컬렉션 타입 검증', () => {
    test('새 컬렉션을 생성할 때 필수 필드가 포함되어야 한다', () => {
      // Red: 실패하는 테스트 작성
      const collection = createCollection('테스트 컬렉션')
      expect(collection).toHaveProperty('id')
      expect(collection).toHaveProperty('title', '테스트 컬렉션')
      expect(collection).toHaveProperty('createdAt')
    })

    test('컬렉션 ID는 고유해야 한다', () => {
      const collection1 = createCollection('컬렉션 1')
      const collection2 = createCollection('컬렉션 2')
      expect(collection1.id).not.toBe(collection2.id)
    })
  })
  ```
  **TDD 커밋 단위 작업**: ✅ **완료**
  1. ✅ `c9b6e11: test: 컬렉션 타입 유효성 검증 실패 테스트 작성` (🔴 Red)
  2. ✅ `c9b6e11: feat: Collection 인터페이스 및 팩토리 함수 구현` (🟢 Green)
  3. ✅ `c9b6e11: refactor: 컬렉션 타입 안전성 개선` (🔵 Refactor)

  4. ✅ `3eba5f3: test: 탭 타입 유효성 검증 실패 테스트 작성` (🔴 Red)
  5. ✅ `7e6de4c: feat: 탭 타입 관련 유틸리티 함수 구현` (🟢 Green)
  6. ✅ `07cc1c7: refactor: 탭 타입 시스템 안전성 및 구조 개선` (🔵 Refactor)

  **실제 구현 결과 (계획 변경)**:
  - 컬렉션 + 탭 타입만 우선 완료 (태그, 설정은 후속 Phase에서 처리)
  - 총 28개 테스트 모두 통과 ✅
  - 공통 validation 시스템 완성
  - 링크/노트 타입별 특별 검증 로직 구현
  - **Phase 1.2.1 완료** ✅

- **1.2.2 공통 유틸리티 함수** (1일)
  ```typescript
  describe('ID 생성 유틸리티', () => {
    test('고유한 ID를 생성해야 한다', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
    })
  })

  describe('날짜 포맷 유틸리티', () => {
    test('날짜를 YYYY-MM-DD 형식으로 포맷해야 한다', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)
      expect(formatted).toBe('2023-12-25')
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: ID 생성 유틸리티 실패 테스트 작성` (🔴 Red)
  2. `feat: ID 생성 유틸리티 기본 구현` (🟢 Green)
  3. `refactor: ID 생성 로직 최적화` (🔵 Refactor)

  4. `test: 날짜 포맷 유틸리티 실패 테스트 작성` (🔴 Red)
  5. `feat: 날짜 포맷 유틸리티 구현` (🟢 Green)
  6. `refactor: 날짜 처리 에지케이스 보완` (🔵 Refactor)

  7. `test: URL 검증 유틸리티 실패 테스트 작성` (🔴 Red)
  8. `feat: URL 검증 유틸리티 구현` (🟢 Green)
  9. `refactor: URL 검증 정규식 최적화` (🔵 Refactor)

  10. `test: 디바운스 유틸리티 실패 테스트 작성` (🔴 Red)
  11. `feat: 디바운스 유틸리티 구현` (🟢 Green)
  12. `refactor: 디바운스 성능 최적화` (🔵 Refactor)

#### 1.3 기본 CSS 설정 및 테마 시스템
**소요시간**: 1일
**완료 조건**: 라이트/다크 테마가 정상적으로 전환되어야 함

**커밋 단위 작업**:
1. `style: CSS 변수 기반 테마 시스템 구축`
   - [ ] CSS 변수 정의 (색상, 폰트, 간격)
   - [ ] 라이트/다크 테마 색상 팔레트
   - [ ] 반응형 브레이크포인트 설정

2. `style: 기본 스타일 시스템 구성`
   - [ ] 리셋 CSS 적용
   - [ ] 기본 타이포그래피 설정
   - [ ] 버튼, 인풋 기본 스타일

3. `feat: 테마 전환 기능 기본 구현`
   - [ ] 테마 컨텍스트 생성
   - [ ] 로컬 스토리지 연동
   - [ ] 테마 전환 검증

---

### 2️⃣ Phase 2: 상태 관리 및 데이터 레이어 (1주 / 5일)

#### 2.1 Zustand 스토어 구현 (TDD)
**소요시간**: 3일
**완료 조건**: 모든 스토어 액션에 대한 테스트가 통과해야 함

- **2.1.1 컬렉션 스토어** (1.5일)
  ```typescript
  describe('컬렉션 스토어', () => {
    beforeEach(() => {
      useCollectionStore.getState().reset() // 스토어 초기화
    })

    test('새로운 컬렉션을 추가할 수 있다', () => {
      const { addCollection, collections } = useCollectionStore.getState()
      const newCollection = addCollection('새 컬렉션')

      expect(collections).toHaveLength(1)
      expect(collections[0]).toEqual(newCollection)
      expect(newCollection.title).toBe('새 컬렉션')
    })

    test('존재하지 않는 컬렉션을 삭제하려 하면 오류가 발생한다', () => {
      const { removeCollection } = useCollectionStore.getState()

      expect(() => {
        removeCollection('존재하지않는ID')
      }).toThrow('컬렉션을 찾을 수 없습니다')
    })

    test('컬렉션 순서를 변경할 수 있다', () => {
      const { addCollection, reorderCollections, collections } = useCollectionStore.getState()

      const collection1 = addCollection('첫번째')
      const collection2 = addCollection('두번째')

      reorderCollections(collection1.id, collection2.id)

      expect(collections[0].id).toBe(collection2.id)
      expect(collections[1].id).toBe(collection1.id)
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 컬렉션 스토어 기본 CRUD 실패 테스트 작성` (🔴 Red)
  2. `feat: Zustand 컬렉션 스토어 기본 구조 구현` (🟢 Green)
  3. `refactor: 컬렉션 스토어 타입 안전성 강화` (🔵 Refactor)

  4. `test: 컬렉션 추가 기능 실패 테스트 작성` (🔴 Red)
  5. `feat: addCollection 액션 구현` (🟢 Green)
  6. `refactor: 컬렉션 생성 로직 최적화` (🔵 Refactor)

  7. `test: 컬렉션 삭제 기능 실패 테스트 작성` (🔴 Red)
  8. `feat: removeCollection 액션 구현` (🟢 Green)
  9. `refactor: 컬렉션 삭제 에러 처리 개선` (🔵 Refactor)

  10. `test: 컬렉션 순서 변경 실패 테스트 작성` (🔴 Red)
  11. `feat: reorderCollections 액션 구현` (🟢 Green)
  12. `refactor: 컬렉션 정렬 알고리즘 최적화` (🔵 Refactor)

  13. `test: 컬렉션 설정 관리 실패 테스트 작성` (🔴 Red)
  14. `feat: 컬렉션 확장/축소 및 뷰 모드 관리 구현` (🟢 Green)
  15. `refactor: 컬렉션 상태 관리 로직 통합` (🔵 Refactor)

- **2.1.2 탭 스토어** (1.5일)
  ```typescript
  describe('탭 스토어', () => {
    test('유효한 URL로 탭을 추가할 수 있다', () => {
      const { addTab, getTabsByCollection } = useTabStore.getState()
      const collectionId = 'test-collection-id'

      const newTab = addTab({
        title: '구글',
        url: 'https://google.com',
        collectionId
      })

      const tabs = getTabsByCollection(collectionId)
      expect(tabs).toHaveLength(1)
      expect(tabs[0].url).toBe('https://google.com')
    })

    test('잘못된 URL 형식일 때 오류가 발생한다', () => {
      const { addTab } = useTabStore.getState()

      expect(() => {
        addTab({
          title: '잘못된 사이트',
          url: 'invalid-url',
          collectionId: 'test-id'
        })
      }).toThrow('올바른 URL 형식이 아닙니다')
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 탭 스토어 기본 CRUD 실패 테스트 작성` (🔴 Red)
  2. `feat: Zustand 탭 스토어 기본 구조 구현` (🟢 Green)
  3. `refactor: 탭 스토어 인터페이스 최적화` (🔵 Refactor)

  4. `test: 탭 추가 기능 실패 테스트 작성` (🔴 Red)
  5. `feat: addTab 액션 및 URL 검증 구현` (🟢 Green)
  6. `refactor: 탭 생성 로직 및 에러 처리 강화` (🔵 Refactor)

  7. `test: 탭 수정 기능 실패 테스트 작성` (🔴 Red)
  8. `feat: updateTab 액션 구현` (🟢 Green)
  9. `refactor: 탭 업데이트 유효성 검증 개선` (🔵 Refactor)

  10. `test: 탭 삭제 및 이동 실패 테스트 작성` (🔴 Red)
  11. `feat: removeTab 및 moveTab 액션 구현` (🟢 Green)
  12. `refactor: 탭 이동 로직 최적화` (🔵 Refactor)

  13. `test: 탭 정렬 및 검색 실패 테스트 작성` (🔴 Red)
  14. `feat: 탭 정렬 및 필터링 기능 구현` (🟢 Green)
  15. `refactor: 검색 알고리즘 성능 최적화` (🔵 Refactor)

#### 2.2 로컬 스토리지 연동 (TDD)
**소요시간**: 2일
**완료 조건**: 데이터 저장/로드/에러 처리가 모두 테스트를 통과해야 함

- **2.2.1 스토리지 매니저 구현** (1일)
  ```typescript
  describe('로컬 스토리지 관리', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    test('데이터를 로컬 스토리지에 저장할 수 있다', () => {
      const testData = { collections: [], tabs: [] }

      saveToStorage('tab-nexus-data', testData)

      const saved = localStorage.getItem('tab-nexus-data')
      expect(JSON.parse(saved!)).toEqual(testData)
    })

    test('로컬 스토리지에서 데이터를 불러올 수 있다', () => {
      const testData = { collections: [{ id: '1', title: '테스트' }] }
      localStorage.setItem('tab-nexus-data', JSON.stringify(testData))

      const loaded = loadFromStorage('tab-nexus-data')

      expect(loaded).toEqual(testData)
    })

    test('잘못된 데이터 형식일 때 기본값을 반환한다', () => {
      localStorage.setItem('tab-nexus-data', '잘못된JSON{')

      const loaded = loadFromStorage('tab-nexus-data', { collections: [] })

      expect(loaded).toEqual({ collections: [] })
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 로컬 스토리지 기본 저장/로드 실패 테스트 작성` (🔴 Red)
  2. `feat: localStorage 기본 래퍼 함수 구현` (🟢 Green)
  3. `refactor: 스토리지 인터페이스 타입 안전성 강화` (🔵 Refactor)

  4. `test: 데이터 직렬화/역직렬화 실패 테스트 작성` (🔴 Red)
  5. `feat: JSON 직렬화 및 에러 처리 구현` (🟢 Green)
  6. `refactor: 직렬화 성능 최적화` (🔵 Refactor)

  7. `test: 스키마 검증 실패 테스트 작성` (🔴 Red)
  8. `feat: 데이터 스키마 유효성 검증 구현` (🟢 Green)
  9. `refactor: 스키마 마이그레이션 로직 추가` (🔵 Refactor)

  10. `test: 백업 및 복구 실패 테스트 작성` (🔴 Red)
  11. `feat: 자동 백업 및 데이터 복구 기능 구현` (🟢 Green)
  12. `refactor: 백업 스토리지 최적화` (🔵 Refactor)

- **2.2.2 자동 저장 시스템** (1일)
  ```typescript
  describe('자동 저장 시스템', () => {
    test('스토어 변경시 자동으로 저장된다', async () => {
      const { addCollection } = useCollectionStore.getState()

      addCollection('자동저장 테스트')

      // 디바운스 대기
      await waitFor(() => {
        const saved = localStorage.getItem('tab-nexus-collections')
        expect(saved).toContain('자동저장 테스트')
      }, { timeout: 1000 })
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 스토어 변경 감지 실패 테스트 작성` (🔴 Red)
  2. `feat: Zustand 스토어 변경 감지 미들웨어 구현` (🟢 Green)
  3. `refactor: 변경 감지 성능 최적화` (🔵 Refactor)

  4. `test: 디바운스 자동 저장 실패 테스트 작성` (🔴 Red)
  5. `feat: debounced 자동 저장 시스템 구현` (🟢 Green)
  6. `refactor: 디바운스 타이밍 및 메모리 최적화` (🔵 Refactor)

  7. `test: 저장 실패 처리 및 재시도 실패 테스트 작성` (🔴 Red)
  8. `feat: 저장 실패시 재시도 로직 구현` (🟢 Green)
  9. `refactor: 재시도 백오프 전략 개선` (🔵 Refactor)

  10. `test: 동시성 저장 충돌 실패 테스트 작성` (🔴 Red)
  11. `feat: 동시 저장 요청 큐잉 시스템 구현` (🟢 Green)
  12. `refactor: 저장 큐 최적화 및 메모리 관리` (🔵 Refactor)

---

### 3️⃣ Phase 3: 컬렉션 관리 기능 (1-2주 / 7일)

#### 3.1 컬렉션 CRUD UI (TDD)
**소요시간**: 3일
**완료 조건**: 사용자가 컬렉션을 생성/편집/삭제할 수 있어야 함

- **3.1.1 컬렉션 생성 컴포넌트** (1일)
  ```typescript
  describe('컬렉션 생성 버튼', () => {
    test('플러스 버튼을 클릭하면 새 컬렉션이 추가된다', async () => {
      render(<CollectionList />)
      const user = userEvent.setup()

      const addButton = screen.getByLabelText('새 컬렉션 추가')
      await user.click(addButton)

      expect(screen.getByText('새 컬렉션')).toBeInTheDocument()
    })

    test('빈 제목으로는 컬렉션을 생성할 수 없다', async () => {
      render(<CollectionCreateModal />)
      const user = userEvent.setup()

      const input = screen.getByPlaceholderText('컬렉션 제목')
      const saveButton = screen.getByText('저장')

      await user.click(saveButton)

      expect(screen.getByText('제목을 입력해주세요')).toBeInTheDocument()
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 컬렉션 생성 버튼 렌더링 실패 테스트 작성` (🔴 Red)
  2. `feat: 기본 컬렉션 생성 버튼 컴포넌트 구현` (🟢 Green)
  3. `refactor: 버튼 컴포넌트 접근성 개선` (🔵 Refactor)

  4. `test: 새 컬렉션 추가 기능 실패 테스트 작성` (🔴 Red)
  5. `feat: addCollection 액션 연결 및 기본 UI 구현` (🟢 Green)
  6. `refactor: 컬렉션 추가 UX 최적화` (🔵 Refactor)

  7. `test: 컬렉션 제목 유효성 검증 실패 테스트 작성` (🔴 Red)
  8. `feat: 제목 입력 검증 및 에러 메시지 구현` (🟢 Green)
  9. `refactor: 폼 검증 로직 모듈화` (🔵 Refactor)

  10. `test: 컬렉션 생성 모달 실패 테스트 작성` (🔴 Red)
  11. `feat: CollectionCreateModal 컴포넌트 구현` (🟢 Green)
  12. `refactor: 모달 상태 관리 최적화` (🔵 Refactor)

- **3.1.2 컬렉션 편집 기능** (1일)
  ```typescript
  describe('컬렉션 제목 편집', () => {
    test('컬렉션 제목을 더블클릭하면 편집 모드가 된다', async () => {
      const collection = { id: '1', title: '기존 제목' }
      render(<CollectionHeader collection={collection} />)
      const user = userEvent.setup()

      const title = screen.getByText('기존 제목')
      await user.dblClick(title)

      expect(screen.getByDisplayValue('기존 제목')).toBeInTheDocument()
    })

    test('ESC 키를 누르면 편집이 취소된다', async () => {
      render(<CollectionTitleEditor initialTitle="기존 제목" />)
      const user = userEvent.setup()

      const input = screen.getByDisplayValue('기존 제목')
      await user.clear(input)
      await user.type(input, '변경된 제목')
      await user.keyboard('{Escape}')

      expect(screen.getByText('기존 제목')).toBeInTheDocument()
    })

    test('Enter 키를 누르면 편집이 저장된다', async () => {
      render(<CollectionTitleEditor initialTitle="기존 제목" />)
      const user = userEvent.setup()

      const input = screen.getByDisplayValue('기존 제목')
      await user.clear(input)
      await user.type(input, '새로운 제목{Enter}')

      expect(screen.getByText('새로운 제목')).toBeInTheDocument()
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 컬렉션 헤더 컴포넌트 렌더링 실패 테스트 작성` (🔴 Red)
  2. `feat: CollectionHeader 기본 컴포넌트 구현` (🟢 Green)
  3. `refactor: 헤더 레이아웃 및 스타일링 최적화` (🔵 Refactor)

  4. `test: 제목 더블클릭 편집 모드 실패 테스트 작성` (🔴 Red)
  5. `feat: 인라인 제목 편집 기능 구현` (🟢 Green)
  6. `refactor: 편집 모드 상태 관리 최적화` (🔵 Refactor)

  7. `test: ESC 키 편집 취소 실패 테스트 작성` (🔴 Red)
  8. `feat: 키보드 이벤트 핸들링 구현` (🟢 Green)
  9. `refactor: 키보드 인터랙션 접근성 개선` (🔵 Refactor)

  10. `test: Enter 키 저장 기능 실패 테스트 작성` (🔴 Red)
  11. `feat: CollectionTitleEditor 컴포넌트 구현` (🟢 Green)
  12. `refactor: 제목 편집 UX 및 검증 강화` (🔵 Refactor)

- **3.1.3 컬렉션 삭제 기능** (1일)
  ```typescript
  describe('컬렉션 삭제', () => {
    test('삭제 버튼을 클릭하면 확인 대화상자가 표시된다', async () => {
      render(<CollectionActions collectionId="test-id" />)
      const user = userEvent.setup()

      const deleteButton = screen.getByLabelText('컬렉션 삭제')
      await user.click(deleteButton)

      expect(screen.getByText('정말로 삭제하시겠습니까?')).toBeInTheDocument()
    })

    test('확인을 클릭하면 컬렉션이 삭제된다', async () => {
      const onDelete = vi.fn()
      render(<DeleteConfirmModal onConfirm={onDelete} />)
      const user = userEvent.setup()

      const confirmButton = screen.getByText('삭제')
      await user.click(confirmButton)

      expect(onDelete).toHaveBeenCalled()
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 컬렉션 액션 버튼 그룹 렌더링 실패 테스트 작성` (🔴 Red)
  2. `feat: CollectionActions 컴포넌트 기본 구조 구현` (🟢 Green)
  3. `refactor: 액션 버튼 레이아웃 및 아이콘 최적화` (🔵 Refactor)

  4. `test: 삭제 버튼 클릭시 확인 모달 실패 테스트 작성` (🔴 Red)
  5. `feat: 삭제 확인 대화상자 구현` (🟢 Green)
  6. `refactor: 모달 UX 및 접근성 개선` (🔵 Refactor)

  7. `test: 삭제 확인 기능 실패 테스트 작성` (🔴 Red)
  8. `feat: DeleteConfirmModal 및 삭제 로직 구현` (🟢 Green)
  9. `refactor: 삭제 처리 에러 핸들링 강화` (🔵 Refactor)

  10. `test: 삭제 취소 기능 실패 테스트 작성` (🔴 Red)
  11. `feat: 삭제 취소 및 모달 닫기 구현` (🟢 Green)
  12. `refactor: 컬렉션 삭제 전체 플로우 최적화` (🔵 Refactor)

#### 3.2 컬렉션 드래그앤드롭 (TDD)
**소요시간**: 2일

- **3.2.1 드래그앤드롭 기본 구현** (1일)
  ```typescript
  describe('컬렉션 드래그앤드롭', () => {
    test('컬렉션을 드래그해서 순서를 변경할 수 있다', async () => {
      const collections = [
        { id: '1', title: '첫번째' },
        { id: '2', title: '두번째' }
      ]
      render(<CollectionList collections={collections} />)

      const firstItem = screen.getByText('첫번째')
      const secondItem = screen.getByText('두번째')

      // DnD Kit 테스트 유틸리티 사용
      await dragAndDrop(firstItem, secondItem)

      // 순서가 바뀌었는지 확인
      const items = screen.getAllByTestId('collection-item')
      expect(items[0]).toHaveTextContent('두번째')
      expect(items[1]).toHaveTextContent('첫번째')
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: @dnd-kit 라이브러리 설치 및 설정 실패 테스트 작성` (🔴 Red)
  2. `feat: @dnd-kit 패키지 설치 및 기본 Provider 설정` (🟢 Green)
  3. `refactor: DnD 컨텍스트 및 전역 설정 최적화` (🔵 Refactor)

  4. `test: 컬렉션 리스트 드래그 가능 상태 실패 테스트 작성` (🔴 Red)
  5. `feat: CollectionList 드래그 가능 컴포넌트로 변환` (🟢 Green)
  6. `refactor: 드래그 핸들 UI 및 접근성 개선` (🔵 Refactor)

  7. `test: 컬렉션 순서 변경 드롭 실패 테스트 작성` (🔴 Red)
  8. `feat: 드롭 영역 및 순서 변경 로직 구현` (🟢 Green)
  9. `refactor: 드래그앤드롭 성능 및 애니메이션 최적화` (🔵 Refactor)

  10. `test: 시각적 피드백 및 드래그 오버레이 실패 테스트 작성` (🔴 Red)
  11. `feat: 드래그 미리보기 및 드롭 존 하이라이트 구현` (🟢 Green)
  12. `refactor: 드래그 UX 및 시각적 피드백 강화` (🔵 Refactor)

#### 3.3 컬렉션 상태 관리 (확장/축소)
**소요시간**: 2일

- **3.3.1 컬렉션 확장/축소 UI** (2일)
  ```typescript
  describe('컬렉션 확장/축소', () => {
    test('화살표 버튼을 클릭하면 컬렉션이 접힌다', async () => {
      const collection = { id: '1', title: '테스트', isExpanded: true }
      render(<Collection collection={collection} />)
      const user = userEvent.setup()

      const toggleButton = screen.getByLabelText('컬렉션 접기')
      await user.click(toggleButton)

      expect(screen.queryByTestId('collection-content')).not.toBeInTheDocument()
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 컬렉션 확장/축소 토글 버튼 렌더링 실패 테스트 작성` (🔴 Red)
  2. `feat: 컬렉션 확장/축소 토글 버튼 컴포넌트 구현` (🟢 Green)
  3. `refactor: 토글 버튼 아이콘 및 접근성 개선` (🔵 Refactor)

  4. `test: 컬렉션 확장 상태 관리 실패 테스트 작성` (🔴 Red)
  5. `feat: isExpanded 상태 관리 로직 구현` (🟢 Green)
  6. `refactor: 상태 변경 성능 최적화 및 메모이제이션` (🔵 Refactor)

  7. `test: 컬렉션 콘텐츠 토글 애니메이션 실패 테스트 작성` (🔴 Red)
  8. `feat: 확장/축소 애니메이션 및 전환 효과 구현` (🟢 Green)
  9. `refactor: 애니메이션 성능 및 접근성 최적화` (🔵 Refactor)

  10. `test: 컬렉션 상태 지속성 실패 테스트 작성` (🔴 Red)
  11. `feat: 컬렉션 확장 상태 localStorage 저장 구현` (🟢 Green)
  12. `refactor: 상태 지속성 로직 통합 및 최적화` (🔵 Refactor)

  13. `test: 키보드 네비게이션 실패 테스트 작성` (🔴 Red)
  14. `feat: Space/Enter 키로 컬렉션 토글 기능 구현` (🟢 Green)
  15. `refactor: 키보드 접근성 전체적 개선` (🔵 Refactor)

---

### 4️⃣ Phase 4: 탭 관리 기능 (2주 / 10일)

#### 4.1 탭 CRUD UI (TDD)
**소요시간**: 4일

- **4.1.1 탭 추가 기능** (1.5일)
  ```typescript
  describe('탭 추가 기능', () => {
    test('URL을 입력하고 추가 버튼을 클릭하면 탭이 추가된다', async () => {
      render(<TabAddForm collectionId="test-id" />)
      const user = userEvent.setup()

      const urlInput = screen.getByPlaceholderText('URL을 입력하세요')
      const addButton = screen.getByText('추가')

      await user.type(urlInput, 'https://google.com')
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Google')).toBeInTheDocument()
      })
    })

    test('잘못된 URL 형식일 때 오류 메시지가 표시된다', async () => {
      render(<TabAddForm />)
      const user = userEvent.setup()

      const urlInput = screen.getByPlaceholderText('URL을 입력하세요')
      await user.type(urlInput, 'invalid-url')

      expect(screen.getByText('올바른 URL을 입력해주세요')).toBeInTheDocument()
    })

    test('노트 타입 탭을 추가할 수 있다', async () => {
      render(<TabAddForm />)
      const user = userEvent.setup()

      const noteButton = screen.getByText('노트 추가')
      await user.click(noteButton)

      const titleInput = screen.getByPlaceholderText('노트 제목')
      await user.type(titleInput, '새 노트')

      const saveButton = screen.getByText('저장')
      await user.click(saveButton)

      expect(screen.getByText('새 노트')).toBeInTheDocument()
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 탭 추가 폼 컴포넌트 렌더링 실패 테스트 작성` (🔴 Red)
  2. `feat: TabAddForm 기본 컴포넌트 구조 구현` (🟢 Green)
  3. `refactor: 폼 레이아웃 및 스타일링 최적화` (🔵 Refactor)

  4. `test: URL 입력 및 검증 실패 테스트 작성` (🔴 Red)
  5. `feat: URL 입력 필드 및 실시간 검증 구현` (🟢 Green)
  6. `refactor: URL 검증 로직 모듈화 및 성능 최적화` (🔵 Refactor)

  7. `test: 웹페이지 메타데이터 가져오기 실패 테스트 작성` (🔴 Red)
  8. `feat: 웹페이지 제목 및 파비콘 자동 추출 구현` (🟢 Green)
  9. `refactor: 메타데이터 추출 에러 처리 및 폴백 로직` (🔵 Refactor)

  10. `test: 탭 추가 액션 연결 실패 테스트 작성` (🔴 Red)
  11. `feat: addTab 스토어 액션 연결 및 성공 피드백` (🟢 Green)
  12. `refactor: 탭 추가 완료후 폼 초기화 및 UX 개선` (🔵 Refactor)

  13. `test: 노트 타입 탭 추가 실패 테스트 작성` (🔴 Red)
  14. `feat: 노트 타입 탭 생성 모드 및 에디터 구현` (🟢 Green)
  15. `refactor: 노트 에디터 접근성 및 키보드 네비게이션` (🔵 Refactor)

  16. `test: 탭 추가 에러 처리 실패 테스트 작성` (🔴 Red)
  17. `feat: 네트워크 오류 및 중복 URL 처리 구현` (🟢 Green)
  18. `refactor: 전체 탭 추가 플로우 에러 처리 통합` (🔵 Refactor)

- **4.1.2 탭 편집 모달** (1.5일)
  ```typescript
  describe('탭 편집 모달', () => {
    test('편집 버튼을 클릭하면 편집 모달이 열린다', async () => {
      const tab = { id: '1', title: '구글', url: 'https://google.com' }
      render(<TabCard tab={tab} />)
      const user = userEvent.setup()

      const editButton = screen.getByLabelText('탭 편집')
      await user.click(editButton)

      expect(screen.getByText('탭 편집')).toBeInTheDocument()
      expect(screen.getByDisplayValue('구글')).toBeInTheDocument()
    })

    test('제목을 수정하고 저장할 수 있다', async () => {
      render(<TabEditModal tab={mockTab} />)
      const user = userEvent.setup()

      const titleInput = screen.getByLabelText('제목')
      await user.clear(titleInput)
      await user.type(titleInput, '수정된 제목')

      const saveButton = screen.getByText('저장')
      await user.click(saveButton)

      expect(mockOnSave).toHaveBeenCalledWith({
        ...mockTab,
        title: '수정된 제목'
      })
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 탭 편집 모달 트리거 버튼 실패 테스트 작성` (🔴 Red)
  2. `feat: 탭 카드 편집 버튼 및 모달 트리거 구현` (🟢 Green)
  3. `refactor: 편집 버튼 접근성 및 아이콘 최적화` (🔵 Refactor)

  4. `test: TabEditModal 컴포넌트 렌더링 실패 테스트 작성` (🔴 Red)
  5. `feat: 탭 편집 모달 기본 구조 및 폼 구현` (🟢 Green)
  6. `refactor: 모달 레이아웃 및 반응형 디자인 최적화` (🔵 Refactor)

  7. `test: 탭 제목 편집 기능 실패 테스트 작성` (🔴 Red)
  8. `feat: 제목 입력 필드 및 실시간 검증 구현` (🟢 Green)
  9. `refactor: 제목 편집 UX 및 검증 로직 개선` (🔵 Refactor)

  10. `test: 탭 URL 및 설명 편집 실패 테스트 작성` (🔴 Red)
  11. `feat: URL 및 설명 필드 편집 기능 구현` (🟢 Green)
  12. `refactor: 편집 폼 검증 로직 통합` (🔵 Refactor)

  13. `test: 탭 편집 저장 및 취소 실패 테스트 작성` (🔴 Red)
  14. `feat: updateTab 액션 연결 및 모달 닫기 구현` (🟢 Green)
  15. `refactor: 편집 완료 플로우 및 에러 처리 강화` (🔵 Refactor)

  16. `test: 노트 타입 탭 편집 실패 테스트 작성` (🔴 Red)
  17. `feat: 노트 콘텐츠 편집기 및 미리보기 구현` (🟢 Green)
  18. `refactor: 노트 편집 UX 및 자동 저장 기능` (🔵 Refactor)

- **4.1.3 탭 삭제 기능** (1일)
  ```typescript
  describe('탭 삭제', () => {
    test('삭제 버튼을 클릭하면 탭이 삭제된다', async () => {
      render(<TabCard tab={mockTab} />)
      const user = userEvent.setup()

      const deleteButton = screen.getByLabelText('탭 삭제')
      await user.click(deleteButton)

      // 확인 대화상자에서 확인 클릭
      const confirmButton = screen.getByText('삭제')
      await user.click(confirmButton)

      await waitFor(() => {
        expect(screen.queryByText(mockTab.title)).not.toBeInTheDocument()
      })
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 탭 삭제 버튼 렌더링 실패 테스트 작성` (🔴 Red)
  2. `feat: 탭 카드 삭제 버튼 컴포넌트 구현` (🟢 Green)
  3. `refactor: 삭제 버튼 접근성 및 위험 스타일링` (🔵 Refactor)

  4. `test: 탭 삭제 확인 대화상자 실패 테스트 작성` (🔴 Red)
  5. `feat: 삭제 확인 모달 및 경고 메시지 구현` (🟢 Green)
  6. `refactor: 확인 모달 UX 및 키보드 네비게이션` (🔵 Refactor)

  7. `test: 탭 삭제 액션 실행 실패 테스트 작성` (🔴 Red)
  8. `feat: removeTab 스토어 액션 연결 및 UI 업데이트` (🟢 Green)
  9. `refactor: 탭 삭제 에러 처리 및 롤백 로직` (🔵 Refactor)

  10. `test: 다중 탭 선택 삭제 실패 테스트 작성` (🔴 Red)
  11. `feat: Shift+클릭 다중 선택 및 일괄 삭제 구현` (🟢 Green)
  12. `refactor: 다중 삭제 성능 최적화 및 취소 기능` (🔵 Refactor)

#### 4.2 탭 카드 컴포넌트 (TDD)
**소요시간**: 3일

- **4.2.1 기본 탭 카드 렌더링** (1일)
  ```typescript
  describe('탭 카드 컴포넌트', () => {
    test('탭 제목과 URL이 표시된다', () => {
      const tab = {
        id: '1',
        title: '구글',
        url: 'https://google.com',
        favicon: 'https://google.com/favicon.ico'
      }

      render(<TabCard tab={tab} />)

      expect(screen.getByText('구글')).toBeInTheDocument()
      expect(screen.getByText('google.com')).toBeInTheDocument()
    })

    test('파비콘이 로드되지 않으면 기본 아이콘이 표시된다', () => {
      const tab = { ...mockTab, favicon: null }

      render(<TabCard tab={tab} />)

      expect(screen.getByTestId('default-favicon')).toBeInTheDocument()
    })

    test('긴 제목은 말줄임표로 처리된다', () => {
      const longTitle = 'A'.repeat(100)
      const tab = { ...mockTab, title: longTitle }

      render(<TabCard tab={tab} />)

      const titleElement = screen.getByText(longTitle)
      expect(titleElement).toHaveStyle({
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      })
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 탭 카드 기본 렌더링 실패 테스트 작성` (🔴 Red)
  2. `feat: TabCard 컴포넌트 기본 구조 및 레이아웃 구현` (🟢 Green)
  3. `refactor: 탭 카드 CSS 모듈 및 스타일링 최적화` (🔵 Refactor)

  4. `test: 탭 제목 및 URL 표시 실패 테스트 작성` (🔴 Red)
  5. `feat: 탭 제목, URL 표시 로직 및 도메인 추출 구현` (🟢 Green)
  6. `refactor: URL 파싱 유틸리티 모듈화 및 성능 최적화` (🔵 Refactor)

  7. `test: 파비콘 로딩 및 폴백 실패 테스트 작성` (🔴 Red)
  8. `feat: 파비콘 이미지 로딩 및 기본 아이콘 폴백 구현` (🟢 Green)
  9. `refactor: 이미지 로딩 에러 처리 및 캐싱 최적화` (🔵 Refactor)

  10. `test: 긴 제목 말줄임 처리 실패 테스트 작성` (🔴 Red)
  11. `feat: CSS 말줄임 및 툴팁 호버 기능 구현` (🟢 Green)
  12. `refactor: 반응형 텍스트 처리 및 접근성 개선` (🔵 Refactor)

- **4.2.2 노트 카드 특수 처리** (1일)
  ```typescript
  describe('노트 카드', () => {
    test('노트 타입 탭은 다른 배경색으로 표시된다', () => {
      const noteTab = { ...mockTab, type: 'note' as const }

      render(<TabCard tab={noteTab} />)

      const cardElement = screen.getByTestId('tab-card')
      expect(cardElement).toHaveClass('card--note')
    })

    test('노트 내용이 미리보기로 표시된다', () => {
      const noteTab = {
        ...mockTab,
        type: 'note' as const,
        noteContent: '이것은 노트 내용입니다'
      }

      render(<TabCard tab={noteTab} />)

      expect(screen.getByText('이것은 노트 내용입니다')).toBeInTheDocument()
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 노트 타입 탭 감지 및 스타일링 실패 테스트 작성` (🔴 Red)
  2. `feat: 노트 탭 타입별 조건부 스타일링 구현` (🟢 Green)
  3. `refactor: 탭 타입별 테마 시스템 통합` (🔵 Refactor)

  4. `test: 노트 콘텐츠 미리보기 실패 테스트 작성` (🔴 Red)
  5. `feat: 노트 내용 미리보기 및 말줄임 처리 구현` (🟢 Green)
  6. `refactor: 마크다운 렌더링 및 XSS 방지 보안` (🔵 Refactor)

  7. `test: 노트 카드 특수 액션 실패 테스트 작성` (🔴 Red)
  8. `feat: 노트 전용 편집 버튼 및 빠른 편집 구현` (🟢 Green)
  9. `refactor: 노트 카드 전체 UX 최적화` (🔵 Refactor)

#### 4.3 탭 드래그앤드롭 (TDD)
**소요시간**: 3일

- **4.3.1 같은 컬렉션 내 정렬** (1일)
  ```typescript
  describe('탭 카드 드래그앤드롭', () => {
    test('같은 컬렉션 내에서 탭 순서를 변경할 수 있다', async () => {
      const tabs = [
        { id: '1', title: '첫번째 탭', sortOrder: 0 },
        { id: '2', title: '두번째 탭', sortOrder: 1 }
      ]

      render(<TabGrid tabs={tabs} />)

      const firstTab = screen.getByText('첫번째 탭')
      const secondTab = screen.getByText('두번째 탭')

      await dragAndDrop(firstTab, secondTab)

      // 순서 변경 액션이 호출되었는지 확인
      expect(mockReorderTabs).toHaveBeenCalledWith('1', '2')
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 탭 그리드 드래그 가능 상태 실패 테스트 작성` (🔴 Red)
  2. `feat: TabGrid @dnd-kit Sortable 통합 구현` (🟢 Green)
  3. `refactor: 드래그 핸들 UI 및 접근성 최적화` (🔵 Refactor)

  4. `test: 같은 컬렉션 내 탭 순서 변경 실패 테스트 작성` (🔴 Red)
  5. `feat: 탭 순서 변경 로직 및 애니메이션 구현` (🟢 Green)
  6. `refactor: 순서 변경 성능 최적화 및 상태 동기화` (🔵 Refactor)

- **4.3.2 컬렉션 간 이동** (1.5일)
  ```typescript
  describe('컬렉션 간 탭 이동', () => {
    test('다른 컬렉션으로 탭을 이동할 수 있다', async () => {
      render(
        <div>
          <Collection id="collection1" />
          <Collection id="collection2" />
        </div>
      )

      const tab = screen.getByTestId('tab-1')
      const targetCollection = screen.getByTestId('collection2-dropzone')

      await dragAndDrop(tab, targetCollection)

      expect(mockMoveTab).toHaveBeenCalledWith('tab-1', 'collection2')
    })

    test('드래그 중에는 시각적 피드백이 제공된다', async () => {
      render(<TabCard tab={mockTab} />)

      const tabCard = screen.getByTestId('tab-card')

      fireEvent.dragStart(tabCard)

      expect(tabCard).toHaveClass('dragging')
      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument()
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 컬렉션 드롭존 생성 실패 테스트 작성` (🔴 Red)
  2. `feat: 컬렉션 드롭존 컴포넌트 및 드롭 감지 구현` (🟢 Green)
  3. `refactor: 드롭존 시각적 피드백 및 애니메이션` (🔵 Refactor)

  4. `test: 컬렉션 간 탭 이동 실패 테스트 작성` (🔴 Red)
  5. `feat: 탭 컬렉션 간 이동 로직 구현` (🟢 Green)
  6. `refactor: 이동 시 데이터 정합성 검증 강화` (🔵 Refactor)

  7. `test: 드래그 오버레이 및 미리보기 실패 테스트 작성` (🔴 Red)
  8. `feat: 커스텀 드래그 오버레이 및 미리보기 구현` (🟢 Green)
  9. `refactor: 드래그 UX 전체적 개선 및 성능 최적화` (🔵 Refactor)

  10. `test: 모바일 터치 드래그 실패 테스트 작성` (🔴 Red)
  11. `feat: 터치 이벤트 및 모바일 드래그 지원 구현` (🟢 Green)
  12. `refactor: 크로스 플랫폼 드래그 동작 통합` (🔵 Refactor)

---

### 5️⃣ Phase 5: 뷰 모드 및 정렬 시스템 (1주 / 5일)

#### 5.1 뷰 모드 전환 (TDD)
**소요시간**: 3일

- **5.1.1 뷰 모드 컨트롤** (1일)
  ```typescript
  describe('뷰 모드 전환', () => {
    test('그리드 뷰에서 리스트 뷰로 전환할 수 있다', async () => {
      render(<ViewModeToggle />)
      const user = userEvent.setup()

      const listViewButton = screen.getByLabelText('리스트 뷰')
      await user.click(listViewButton)

      expect(mockSetViewMode).toHaveBeenCalledWith('list')
    })

    test('뷰 모드 변경이 로컬 스토리지에 저장된다', async () => {
      render(<ViewModeToggle />)
      const user = userEvent.setup()

      const condensedViewButton = screen.getByLabelText('압축 뷰')
      await user.click(condensedViewButton)

      expect(localStorage.getItem('viewMode')).toBe('condensed')
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 뷰 모드 토글 컴포넌트 렌더링 실패 테스트 작성` (🔴 Red)
  2. `feat: ViewModeToggle 4가지 뷰 모드 버튼 구현` (🟢 Green)
  3. `refactor: 뷰 모드 버튼 접근성 및 아이콘 최적화` (🔵 Refactor)

  4. `test: 뷰 모드 전환 액션 실패 테스트 작성` (🔴 Red)
  5. `feat: setViewMode 스토어 액션 연결 및 상태 관리` (🟢 Green)
  6. `refactor: 뷰 모드 상태 지속성 및 동기화 개선` (🔵 Refactor)

  7. `test: 로컬 스토리지 뷰 모드 저장 실패 테스트 작성` (🔴 Red)
  8. `feat: 뷰 모드 localStorage 자동 저장 및 복원` (🟢 Green)
  9. `refactor: 뷰 모드 설정 관리 통합 최적화` (🔵 Refactor)

- **5.1.2 각 뷰 모드별 렌더링** (2일)
  ```typescript
  describe('뷰 모드별 탭 표시', () => {
    const mockTabs = [
      { id: '1', title: '첫번째', url: 'https://example1.com' },
      { id: '2', title: '두번째', url: 'https://example2.com' }
    ]

    test('그리드 뷰에서는 카드 형태로 표시된다', () => {
      render(<TabGrid tabs={mockTabs} viewMode="grid" />)

      const container = screen.getByTestId('tab-grid')
      expect(container).toHaveClass('grid-view')

      mockTabs.forEach(tab => {
        expect(screen.getByText(tab.title)).toBeVisible()
      })
    })

    test('리스트 뷰에서는 한 줄로 표시된다', () => {
      render(<TabGrid tabs={mockTabs} viewMode="list" />)

      const container = screen.getByTestId('tab-grid')
      expect(container).toHaveClass('list-view')

      const tabElements = screen.getAllByTestId('tab-card')
      tabElements.forEach(element => {
        expect(element).toHaveClass('list-item')
      })
    })

    test('압축 뷰에서는 작은 크기로 표시된다', () => {
      render(<TabGrid tabs={mockTabs} viewMode="condensed" />)

      const tabElements = screen.getAllByTestId('tab-card')
      tabElements.forEach(element => {
        expect(element).toHaveClass('condensed')
      })
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 그리드 뷰 렌더링 및 레이아웃 실패 테스트 작성` (🔴 Red)
  2. `feat: 그리드 뷰 CSS Grid 레이아웃 구현` (🟢 Green)
  3. `refactor: 그리드 뷰 반응형 및 성능 최적화` (🔵 Refactor)

  4. `test: 리스트 뷰 렌더링 및 스타일링 실패 테스트 작성` (🔴 Red)
  5. `feat: 리스트 뷰 Flexbox 레이아웃 구현` (🟢 Green)
  6. `refactor: 리스트 뷰 밀도 및 가독성 최적화` (🔵 Refactor)

  7. `test: 압축 뷰 및 그리드 압축 뷰 실패 테스트 작성` (🔴 Red)
  8. `feat: 압축 뷰 컴팩트 레이아웃 구현` (🟢 Green)
  9. `refactor: 압축 뷰 정보 표시 우선순위 최적화` (🔵 Refactor)

  10. `test: 뷰 모드 전환 애니메이션 실패 테스트 작성` (🔴 Red)
  11. `feat: 뷰 모드 간 부드러운 전환 애니메이션` (🟢 Green)
  12. `refactor: 전환 성능 및 접근성 설정 고려` (🔵 Refactor)

  13. `test: 뷰 모드별 드래그앤드롭 호환성 실패 테스트 작성` (🔴 Red)
  14. `feat: 모든 뷰 모드에서 드래그앤드롭 지원` (🟢 Green)
  15. `refactor: 뷰 모드 전체 통합 및 일관성 개선` (🔵 Refactor)

#### 5.2 정렬 시스템 (TDD)
**소요시간**: 2일

- **5.2.1 정렬 컨트롤 UI** (1일)
  ```typescript
  describe('탭 정렬 기능', () => {
    test('제목순 정렬 옵션을 선택할 수 있다', async () => {
      render(<SortControls />)
      const user = userEvent.setup()

      const sortDropdown = screen.getByLabelText('정렬 방식')
      await user.click(sortDropdown)

      const titleSort = screen.getByText('제목순')
      await user.click(titleSort)

      expect(mockSetSortType).toHaveBeenCalledWith('title')
    })

    test('정렬 순서를 오름차순/내림차순으로 변경할 수 있다', async () => {
      render(<SortControls />)
      const user = userEvent.setup()

      const directionButton = screen.getByLabelText('정렬 순서')
      await user.click(directionButton)

      expect(mockToggleSortDirection).toHaveBeenCalled()
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 정렬 컨트롤 드롭다운 실패 테스트 작성` (🔴 Red)
  2. `feat: SortControls 드롭다운 및 정렬 옵션 구현` (🟢 Green)
  3. `refactor: 정렬 UI 접근성 및 키보드 네비게이션` (🔵 Refactor)

  4. `test: 정렬 방향 토글 버튼 실패 테스트 작성` (🔴 Red)
  5. `feat: 오름차순/내림차순 토글 기능 구현` (🟢 Green)
  6. `refactor: 정렬 상태 시각적 피드백 최적화` (🔵 Refactor)

- **5.2.2 정렬 로직 구현** (1일)
  ```typescript
  describe('탭 정렬 로직', () => {
    const mockTabs = [
      { id: '1', title: 'Zebra', createdAt: new Date('2023-01-01') },
      { id: '2', title: 'Apple', createdAt: new Date('2023-01-02') },
      { id: '3', title: 'Banana', createdAt: new Date('2023-01-03') }
    ]

    test('제목순으로 오름차순 정렬된다', () => {
      const sorted = sortTabs(mockTabs, 'title', 'asc')

      expect(sorted[0].title).toBe('Apple')
      expect(sorted[1].title).toBe('Banana')
      expect(sorted[2].title).toBe('Zebra')
    })

    test('생성일순으로 내림차순 정렬된다', () => {
      const sorted = sortTabs(mockTabs, 'createdAt', 'desc')

      expect(sorted[0].id).toBe('3') // 가장 최근
      expect(sorted[2].id).toBe('1') // 가장 오래된
    })

    test('수동 정렬일 때는 sortOrder를 유지한다', () => {
      const tabsWithOrder = mockTabs.map((tab, index) => ({
        ...tab,
        sortOrder: index
      }))

      const sorted = sortTabs(tabsWithOrder, 'manual', 'asc')

      expect(sorted).toEqual(tabsWithOrder)
    })
  })
  ```
  **TDD 커밋 단위 작업**:
  1. `test: 다양한 정렬 알고리즘 실패 테스트 작성` (🔴 Red)
  2. `feat: sortTabs 유틸리티 함수 및 정렬 로직 구현` (🟢 Green)
  3. `refactor: 정렬 성능 최적화 및 메모이제이션` (🔵 Refactor)

  4. `test: 한국어 제목 정렬 및 특수문자 처리 실패 테스트 작성` (🔴 Red)
  5. `feat: 한국어 문자열 정렬 및 Intl.Collator 적용` (🟢 Green)
  6. `refactor: 다국어 정렬 지원 및 로케일 설정` (🔵 Refactor)

  7. `test: 정렬 상태 지속성 및 복원 실패 테스트 작성` (🔴 Red)
  8. `feat: 정렬 설정 localStorage 저장 및 자동 복원` (🟢 Green)
  9. `refactor: 정렬 전체 시스템 통합 및 최적화` (🔵 Refactor)

---

### 6️⃣ Phase 6: 태그 시스템 (1주 / 5일)

#### 6.1 태그 관리 (TDD)
**소요시간**: 3일

- **6.1.1 태그 생성 및 관리** (1.5일)
  ```typescript
  describe('태그 생성 기능', () => {
    test('새로운 태그를 생성할 수 있다', async () => {
      render(<TagManager />)
      const user = userEvent.setup()

      const createButton = screen.getByText('새 태그')
      await user.click(createButton)

      const nameInput = screen.getByPlaceholderText('태그 이름')
      await user.type(nameInput, '업무')

      const colorPicker = screen.getByLabelText('빨간색')
      await user.click(colorPicker)

      const saveButton = screen.getByText('저장')
      await user.click(saveButton)

      expect(screen.getByText('업무')).toBeInTheDocument()
    })

    test('중복된 태그명으로는 생성할 수 없다', async () => {
      // 기존 태그가 있다고 가정
      const existingTags = [{ name: '업무', color: 'red' }]

      render(<TagCreateForm existingTags={existingTags} />)
      const user = userEvent.setup()

      const nameInput = screen.getByPlaceholderText('태그 이름')
      await user.type(nameInput, '업무')

      expect(screen.getByText('이미 존재하는 태그입니다')).toBeInTheDocument()
    })

    test('태그에 8가지 색상 중 하나를 지정할 수 있다', () => {
      const expectedColors = ['pink', 'blue', 'orange', 'gray', 'purple', 'yellow', 'green', 'brown']

      render(<TagColorPicker />)

      expectedColors.forEach(color => {
        expect(screen.getByLabelText(`${color} 색상`)).toBeInTheDocument()
      })
    })
  })
  ```

- **6.1.2 탭에 태그 추가/제거** (1.5일)
  ```typescript
  describe('탭 태그 관리', () => {
    test('탭에 태그를 추가할 수 있다', async () => {
      const availableTags = [
        { id: '1', name: '업무', color: 'blue' },
        { id: '2', name: '개인', color: 'green' }
      ]

      render(<TabTagEditor tab={mockTab} availableTags={availableTags} />)
      const user = userEvent.setup()

      const tagDropdown = screen.getByLabelText('태그 추가')
      await user.click(tagDropdown)

      const workTag = screen.getByText('업무')
      await user.click(workTag)

      expect(screen.getByText('업무')).toHaveClass('tag', 'tag--blue')
    })

    test('태그를 클릭해서 제거할 수 있다', async () => {
      const tabWithTags = {
        ...mockTab,
        tags: ['업무', '개인']
      }

      render(<TabCard tab={tabWithTags} />)
      const user = userEvent.setup()

      const workTag = screen.getByText('업무')
      await user.click(workTag)

      expect(mockRemoveTagFromTab).toHaveBeenCalledWith(mockTab.id, '업무')
    })
  })
  ```

#### 6.2 태그 필터링 (TDD)
**소요시간**: 2일

- **6.2.1 태그 필터 UI** (1일)
  ```typescript
  describe('태그 필터링', () => {
    test('특정 태그로 탭을 필터링할 수 있다', async () => {
      const tabs = [
        { id: '1', title: '업무 문서', tags: ['업무'] },
        { id: '2', title: '개인 메모', tags: ['개인'] },
        { id: '3', title: '혼합', tags: ['업무', '개인'] }
      ]

      render(<TabList tabs={tabs} />)
      const user = userEvent.setup()

      const tagFilter = screen.getByLabelText('태그로 필터')
      await user.click(tagFilter)

      const workTagFilter = screen.getByText('업무')
      await user.click(workTagFilter)

      expect(screen.getByText('업무 문서')).toBeInTheDocument()
      expect(screen.getByText('혼합')).toBeInTheDocument()
      expect(screen.queryByText('개인 메모')).not.toBeInTheDocument()
    })

    test('여러 태그로 동시에 필터링할 수 있다', async () => {
      const tabs = [
        { id: '1', title: '업무만', tags: ['업무'] },
        { id: '2', title: '개인만', tags: ['개인'] },
        { id: '3', title: '둘다', tags: ['업무', '개인'] }
      ]

      render(<TabList tabs={tabs} />)
      const user = userEvent.setup()

      // 업무 태그 선택
      await user.click(screen.getByText('업무'))
      // 개인 태그도 선택 (AND 조건)
      await user.click(screen.getByText('개인'))

      // 둘 다 가진 탭만 표시
      expect(screen.getByText('둘다')).toBeInTheDocument()
      expect(screen.queryByText('업무만')).not.toBeInTheDocument()
      expect(screen.queryByText('개인만')).not.toBeInTheDocument()
    })
  })
  ```

---

### 7️⃣ Phase 7: 검색 기능 (1주 / 5일)

#### 7.1 검색 엔진 구현 (TDD)
**소요시간**: 3일

- **7.1.1 기본 검색 로직** (2일)
  ```typescript
  describe('검색 기능', () => {
    const mockTabs = [
      {
        id: '1',
        title: '구글 검색',
        url: 'https://google.com',
        description: '검색 엔진 사이트'
      },
      {
        id: '2',
        title: '네이버 블로그',
        url: 'https://blog.naver.com',
        description: '개인 블로그 포스팅'
      }
    ]

    test('탭 제목으로 검색할 수 있다', () => {
      const results = searchTabs(mockTabs, '구글')

      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('구글 검색')
    })

    test('URL로 검색할 수 있다', () => {
      const results = searchTabs(mockTabs, 'google.com')

      expect(results).toHaveLength(1)
      expect(results[0].url).toContain('google.com')
    })

    test('설명 내용으로 검색할 수 있다', () => {
      const results = searchTabs(mockTabs, '블로그')

      expect(results).toHaveLength(1)
      expect(results[0].description).toContain('블로그')
    })

    test('대소문자를 구분하지 않고 검색된다', () => {
      const results = searchTabs(mockTabs, 'GOOGLE')

      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('구글 검색')
    })

    test('부분 문자열로 검색할 수 있다', () => {
      const results = searchTabs(mockTabs, '구글')

      expect(results).toHaveLength(1)
      expect(results[0].title).toContain('구글')
    })
  })
  ```

- **7.1.2 고급 검색 기능** (1일)
  ```typescript
  describe('고급 검색 기능', () => {
    test('여러 키워드로 AND 검색할 수 있다', () => {
      const results = searchTabs(mockTabs, '구글 검색')

      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('구글 검색')
    })

    test('태그와 함께 검색할 수 있다', () => {
      const tabsWithTags = mockTabs.map(tab => ({
        ...tab,
        tags: tab.title.includes('구글') ? ['검색엔진'] : ['블로그']
      }))

      const results = searchTabsWithTags(tabsWithTags, '구글', ['검색엔진'])

      expect(results).toHaveLength(1)
    })
  })
  ```

#### 7.2 검색 UI 구현 (TDD)
**소요시간**: 2일

- **7.2.1 검색바 컴포넌트** (1일)
  ```typescript
  describe('검색바 컴포넌트', () => {
    test('검색어를 입력하면 실시간으로 필터링된다', async () => {
      render(<SearchableTabList tabs={mockTabs} />)
      const user = userEvent.setup()

      const searchInput = screen.getByPlaceholderText('탭 검색...')
      await user.type(searchInput, '구글')

      // 디바운스 대기
      await waitFor(() => {
        expect(screen.getByText('구글 검색')).toBeInTheDocument()
        expect(screen.queryByText('네이버 블로그')).not.toBeInTheDocument()
      }, { timeout: 500 })
    })

    test('검색어를 지우면 모든 탭이 다시 표시된다', async () => {
      render(<SearchableTabList tabs={mockTabs} />)
      const user = userEvent.setup()

      const searchInput = screen.getByPlaceholderText('탭 검색...')
      await user.type(searchInput, '구글')
      await user.clear(searchInput)

      await waitFor(() => {
        expect(screen.getByText('구글 검색')).toBeInTheDocument()
        expect(screen.getByText('네이버 블로그')).toBeInTheDocument()
      })
    })
  })
  ```

- **7.2.2 검색 결과 하이라이팅** (1일)
  ```typescript
  describe('검색 결과 표시', () => {
    test('검색 결과에서 일치하는 부분이 하이라이트된다', () => {
      const searchTerm = '구글'

      render(<HighlightedText text="구글 검색 엔진" searchTerm={searchTerm} />)

      const highlightedElement = screen.getByText('구글')
      expect(highlightedElement).toHaveClass('highlight')
    })

    test('검색 결과가 없으면 안내 메시지가 표시된다', async () => {
      render(<SearchableTabList tabs={mockTabs} />)
      const user = userEvent.setup()

      const searchInput = screen.getByPlaceholderText('탭 검색...')
      await user.type(searchInput, '존재하지않는검색어')

      await waitFor(() => {
        expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument()
      })
    })
  })
  ```

---

### 8️⃣ Phase 8: 테마 시스템 (0.5주 / 2-3일)

#### 8.1 테마 전환 구현 (TDD)
**소요시간**: 2-3일

- **8.1.1 테마 토글 컴포넌트** (1일)
  ```typescript
  describe('테마 시스템', () => {
    test('라이트 테마에서 다크 테마로 전환할 수 있다', async () => {
      render(<ThemeToggle />)
      const user = userEvent.setup()

      const toggleButton = screen.getByLabelText('다크 테마 전환')
      await user.click(toggleButton)

      expect(document.documentElement).toHaveClass('dark-theme')
    })

    test('테마 설정이 로컬 스토리지에 저장된다', async () => {
      render(<ThemeToggle />)
      const user = userEvent.setup()

      const toggleButton = screen.getByLabelText('다크 테마 전환')
      await user.click(toggleButton)

      expect(localStorage.getItem('theme')).toBe('dark')
    })

    test('페이지 새로고침 후에도 테마 설정이 유지된다', () => {
      localStorage.setItem('theme', 'dark')

      render(<App />)

      expect(document.documentElement).toHaveClass('dark-theme')
    })
  })
  ```

- **8.1.2 테마별 스타일 검증** (1-2일)
  ```typescript
  describe('테마별 스타일 적용', () => {
    test('다크 테마에서 적절한 색상이 적용된다', () => {
      document.documentElement.className = 'dark-theme'

      render(<TabCard tab={mockTab} />)

      const cardElement = screen.getByTestId('tab-card')
      const computedStyle = window.getComputedStyle(cardElement)

      // CSS 변수 값 확인
      expect(computedStyle.backgroundColor).toBe('var(--card-bg-dark)')
    })

    test('모든 컴포넌트가 테마 변경에 반응한다', async () => {
      render(<App />)
      const user = userEvent.setup()

      const themeToggle = screen.getByLabelText('테마 전환')
      await user.click(themeToggle)

      // 주요 컴포넌트들이 다크 테마 클래스를 가지는지 확인
      expect(screen.getByTestId('header')).toHaveClass('header--dark')
      expect(screen.getByTestId('sidebar')).toHaveClass('sidebar--dark')
      expect(screen.getByTestId('main-content')).toHaveClass('main--dark')
    })
  })
  ```

---

### 9️⃣ Phase 9: E2E 테스트 및 통합 (1주 / 5일)

#### 9.1 E2E 테스트 시나리오 작성 (TDD)
**소요시간**: 3일

- **9.1.1 핵심 사용자 워크플로우** (2일)
  ```typescript
  // E2E 테스트 (Playwright)
  describe('사용자 워크플로우', () => {
    test('새 사용자가 첫 컬렉션을 만들고 탭을 추가할 수 있다', async ({ page }) => {
      await page.goto('/')

      // 첫 방문 시 안내 메시지 확인
      await expect(page.getByText('첫 번째 컬렉션을 만들어보세요')).toBeVisible()

      // 새 컬렉션 생성
      await page.click('[data-testid="add-collection-button"]')
      await page.fill('[placeholder="컬렉션 제목"]', '업무 탭들')
      await page.press('[placeholder="컬렉션 제목"]', 'Enter')

      // 컬렉션이 생성되었는지 확인
      await expect(page.getByText('업무 탭들')).toBeVisible()

      // 첫 번째 탭 추가
      await page.click('[data-testid="add-tab-button"]')
      await page.fill('[placeholder="URL을 입력하세요"]', 'https://google.com')
      await page.press('[placeholder="URL을 입력하세요"]', 'Enter')

      // 탭이 추가되었는지 확인 (파비콘 로딩 대기)
      await expect(page.getByText('Google')).toBeVisible({ timeout: 10000 })
    })

    test('기존 사용자가 탭을 다른 컬렉션으로 이동할 수 있다', async ({ page }) => {
      // 테스트 데이터 미리 설정
      await page.addInitScript(() => {
        localStorage.setItem('toby-data', JSON.stringify({
          collections: [
            { id: '1', title: '컬렉션 A' },
            { id: '2', title: '컬렉션 B' }
          ],
          tabs: [
            { id: '1', title: '구글', collectionId: '1' }
          ]
        }))
      })

      await page.goto('/')

      // 드래그앤드롭으로 탭 이동
      const sourceTab = page.locator('[data-tab-id="1"]')
      const targetCollection = page.locator('[data-collection-id="2"]')

      await sourceTab.dragTo(targetCollection)

      // 이동 후 확인
      await expect(
        page.locator('[data-collection-id="2"] [data-tab-id="1"]')
      ).toBeVisible()
    })

    test('사용자가 태그로 탭을 필터링하고 검색할 수 있다', async ({ page }) => {
      // 복잡한 테스트 데이터 설정
      await setupComplexTestData(page)

      await page.goto('/')

      // 태그 필터링
      await page.click('[data-testid="tag-filter-업무"]')

      // 업무 태그가 있는 탭만 표시되는지 확인
      await expect(page.getByText('업무 문서')).toBeVisible()
      await expect(page.getByText('개인 메모')).not.toBeVisible()

      // 검색과 필터 조합
      await page.fill('[placeholder="탭 검색..."]', '문서')

      // 업무 태그 + 문서 키워드 조건을 만족하는 탭만 표시
      await expect(page.getByText('업무 문서')).toBeVisible()
      await expect(page.getByText('업무 스프레드시트')).not.toBeVisible()
    })
  })
  ```

- **9.1.3 에러 케이스 및 엣지 케이스** (1일)
  ```typescript
  describe('에러 처리 및 엣지 케이스', () => {
    test('네트워크 오류 시 적절한 메시지를 표시한다', async ({ page }) => {
      // 네트워크 차단
      await page.route('**/*', route => route.abort())

      await page.goto('/')

      await page.click('[data-testid="add-tab-button"]')
      await page.fill('[placeholder="URL을 입력하세요"]', 'https://example.com')
      await page.press('[placeholder="URL을 입력하세요"]', 'Enter')

      await expect(page.getByText('네트워크 오류가 발생했습니다')).toBeVisible()
    })

    test('대용량 데이터에서도 성능이 유지된다', async ({ page }) => {
      // 1000개 탭이 있는 데이터 설정
      await setupLargeDataset(page, { tabCount: 1000 })

      await page.goto('/')

      const startTime = Date.now()

      // 검색 성능 테스트
      await page.fill('[placeholder="탭 검색..."]', '검색어')

      const endTime = Date.now()
      const duration = endTime - startTime

      // 200ms 이내에 응답해야 함
      expect(duration).toBeLessThan(200)
    })
  })
  ```

#### 9.2 성능 최적화 및 리팩토링
**소요시간**: 2일

- **9.2.1 메모이제이션 및 최적화** (1일)
  ```typescript
  describe('성능 최적화 검증', () => {
    test('불필요한 리렌더링이 발생하지 않는다', () => {
      const renderSpy = vi.fn()

      const TestComponent = () => {
        renderSpy()
        return <TabCard tab={mockTab} />
      }

      const { rerender } = render(<TestComponent />)

      // 같은 props로 리렌더링
      rerender(<TestComponent />)

      // React.memo로 인해 리렌더링되지 않아야 함
      expect(renderSpy).toHaveBeenCalledTimes(1)
    })

    test('가상화가 제대로 동작한다', () => {
      const manyTabs = Array.from({ length: 1000 }, (_, i) => ({
        id: `tab-${i}`,
        title: `Tab ${i}`,
        url: `https://example${i}.com`
      }))

      render(<VirtualizedTabList tabs={manyTabs} />)

      // 실제로 렌더링된 DOM 엘리먼트는 화면에 보이는 것만
      const renderedTabs = screen.getAllByTestId('tab-card')
      expect(renderedTabs.length).toBeLessThan(50) // 뷰포트에 보이는 것만
    })
  })
  ```

---

### 🔟 Phase 10: 최종 테스트 및 배포 준비 (1주 / 5일)

#### 10.1 통합 테스트 및 버그 수정
**소요시간**: 3일

- **10.1.1 크로스 브라우저 테스트** (1일)
- **10.1.2 접근성 테스트** (1일)
- **10.1.3 모바일 반응형 테스트** (1일)

#### 10.2 배포 환경 구성
**소요시간**: 2일

- **10.2.1 Vercel/Netlify 배포 설정** (1일)
- **10.2.2 CI/CD 파이프라인 구성** (1일)

---

## 📊 프로젝트 관리 및 품질 관리

### 일일 체크리스트
```markdown
## 매일 할 일 (Daily Checklist)

### 🔴 Red Phase (실패하는 테스트 작성)
- [ ] 오늘 구현할 기능의 테스트 케이스를 한글로 작성했는가?
- [ ] 모든 테스트가 실패하는 것을 확인했는가?
- [ ] 테스트 케이스가 요구사항을 정확히 반영하는가?

### 🟢 Green Phase (테스트 통과하는 코드 작성)
- [ ] 테스트를 통과하는 최소한의 코드를 작성했는가?
- [ ] 모든 기존 테스트가 여전히 통과하는가?
- [ ] 새로 작성한 테스트가 모두 통과하는가?

### 🔵 Refactor Phase (코드 품질 개선)
- [ ] 중복 코드를 제거했는가?
- [ ] 코드 가독성을 개선했는가?
- [ ] 리팩토링 후에도 모든 테스트가 통과하는가?

### 📋 일반 체크리스트
- [ ] 코드 커버리지가 90% 이상인가?
- [ ] ESLint 경고가 없는가?
- [ ] TypeScript 에러가 없는가?
- [ ] Git 커밋 메시지가 컨벤션을 따르는가?

### 📝 Git 커밋 체크리스트
- [ ] TDD 사이클별로 적절한 커밋 타입을 사용했는가?
  - 🔴 Red: `test: [테스트 케이스]`
  - 🟢 Green: `feat: [기능 구현]`
  - 🔵 Refactor: `refactor: [코드 개선]`
- [ ] 커밋 메시지가 `<타입>: [내용]` 형식을 따르는가?
- [ ] 하나의 커밋이 하나의 논리적 변경사항만 포함하는가?
- [ ] 커밋 전에 모든 테스트가 통과하는가?
- [ ] 관련 문서가 함께 업데이트되었는가?
```

### 주간 리뷰 포인트
```markdown
## 주간 리뷰 (Weekly Review)

### 진행 상황 점검
- [ ] 이번 주 목표 달성도: ____%
- [ ] 지연된 작업과 그 이유: _____
- [ ] 다음 주 우선순위 조정이 필요한가?

### 품질 지표 확인
- [ ] 전체 테스트 통과율: ____%
- [ ] 코드 커버리지: ____%
- [ ] E2E 테스트 통과율: ____%
- [ ] 성능 지표 (로딩 시간, 응답 시간)

### 개선점 도출
- [ ] 이번 주 배운 점
- [ ] 다음 주 개선할 점
- [ ] TDD 사이클에서 어려웠던 점
```

### 리스크 관리

| 리스크 | 확률 | 영향 | 대응방안 |
|--------|------|------|----------|
| 복잡한 드래그앤드롭 구현 지연 | 중 | 중 | @dnd-kit 라이브러리 활용, 단순한 버전부터 구현 |
| 대용량 데이터 성능 문제 | 중 | 고 | React.memo, useMemo 적극 활용, 가상화 도입 |
| 테스트 작성 시간 초과 | 고 | 중 | 핵심 기능 우선 테스트, 점진적 커버리지 향상 |
| 브라우저 호환성 문제 | 낮 | 중 | Playwright 크로스 브라우저 테스트, Polyfill 활용 |

---

## 🎯 성공 기준 및 완료 조건

### Phase별 완료 조건

각 Phase는 다음 조건을 모두 만족해야 완료로 간주:

1. **테스트 통과율 100%**: 해당 Phase의 모든 테스트가 통과
2. **코드 커버리지 90% 이상**: 핵심 로직의 충분한 테스트 커버리지
3. **TypeScript 에러 0개**: 타입 안정성 보장
4. **ESLint 경고 0개**: 코드 품질 기준 준수
5. **기능 동작 확인**: 실제 사용자 시나리오에서 정상 동작

### 최종 완료 조건

1. **기능 완성도**: 모든 핵심 기능이 Toby와 동일하게 동작
2. **성능 기준**:
   - 첫 페이지 로딩 < 3초
   - 검색 응답시간 < 200ms
   - 드래그앤드롭 반응성 60fps
3. **품질 기준**:
   - 전체 테스트 커버리지 > 90%
   - E2E 테스트 통과율 100%
   - 접근성 기준 준수 (WCAG 2.1 AA)
4. **사용성**: 모바일/데스크톱 모든 환경에서 원활한 사용

---

## 🔄 Phase 6-10 Git 커밋 단위 작업 요약

### Phase 6: 태그 시스템
**총 커밋 수**: 약 27개 (TDD 사이클 × 9 기능)
- 태그 생성 및 관리: 12커밋 (태그 CRUD, 색상 시스템, 중복 검증, 스토어 통합)
- 탭-태그 연결: 9커밋 (태그 추가/제거, UI 인터랙션, 데이터 정합성)
- 태그 필터링: 6커밋 (필터 UI, 다중 선택, 상태 관리)

### Phase 7: 검색 기능
**총 커밋 수**: 약 21개 (TDD 사이클 × 7 기능)
- 검색 엔진: 12커밋 (기본 검색, 다중 필드, 고급 검색, 태그 조합)
- 검색 UI: 9커밋 (검색바, 하이라이팅, 히스토리, 자동완성)

### Phase 8: 테마 시스템
**총 커밋 수**: 약 12개 (TDD 사이클 × 4 기능)
- 테마 전환: 12커밋 (토글 UI, CSS 변수, 지속성, 전체 통합)

### Phase 9: E2E 테스트 및 통합
**총 커밋 수**: 약 18개 (TDD 사이클 × 6 기능)
- E2E 테스트: 9커밋 (Playwright 설정, 워크플로우 테스트, 엣지 케이스)
- 성능 최적화: 9커밋 (메모이제이션, 가상화, 번들 최적화)

### Phase 10: 최종 테스트 및 배포
**총 커밋 수**: 약 15개 (9 TDD + 6 배포)
- 통합 테스트: 9커밋 (크로스 브라우저, 접근성, 모바일)
- 배포 환경: 6커밋 (Vercel 설정, CI/CD, 도메인, 모니터링)

## 📊 전체 프로젝트 Git 커밋 통계

| Phase | 주요 기능 | 예상 커밋 수 | TDD 사이클 |
|-------|-----------|--------------|------------|
| 1 | 프로젝트 설정 | 45개 | 15사이클 |
| 2 | 상태 관리 | 36개 | 12사이클 |
| 3 | 컬렉션 관리 | 45개 | 15사이클 |
| 4 | 탭 관리 | 66개 | 22사이클 |
| 5 | 뷰모드/정렬 | 30개 | 10사이클 |
| 6 | 태그 시스템 | 27개 | 9사이클 |
| 7 | 검색 기능 | 21개 | 7사이클 |
| 8 | 테마 시스템 | 12개 | 4사이클 |
| 9 | E2E/성능 | 18개 | 6사이클 |
| 10 | 최종 배포 | 15개 | 5사이클 |
| **총계** | **10 Phase** | **315개** | **105사이클** |

## 🎯 Git 커밋 품질 관리 원칙

### TDD 사이클별 커밋 패턴
```bash
# 🔴 Red Phase - 실패하는 테스트 작성
git commit -m "test: [기능명] 실패 테스트 작성"

# 🟢 Green Phase - 최소 구현으로 테스트 통과
git commit -m "feat: [기능명] 기본 구현"

# 🔵 Refactor Phase - 코드 품질 개선
git commit -m "refactor: [기능명] 최적화 및 성능 개선"
```

### 커밋 검증 체크리스트 (매 커밋마다)
- [ ] 모든 기존 테스트가 통과하는가?
- [ ] 새로운 테스트가 추가되었는가? (Red/Green 단계)
- [ ] ESLint 경고가 없는가?
- [ ] TypeScript 컴파일 오류가 없는가?
- [ ] 커밋 메시지가 컨벤션을 따르는가?

### 일일 작업 완료 조건
- [ ] 최소 3개의 TDD 사이클 (9커밋) 완료
- [ ] 코드 커버리지 90% 이상 유지
- [ ] 모든 컴포넌트가 Storybook에 등록됨
- [ ] 접근성 테스트 통과 (axe-core)

---

이 WBS를 통해 체계적이고 품질 높은 TDD 기반 개발을 진행할 수 있습니다. **총 315개의 세밀한 커밋**으로 구성된 각 단계별로 명확한 테스트 케이스와 완료 조건이 정의되어 있어 프로젝트 진행 상황을 명확히 추적할 수 있습니다.