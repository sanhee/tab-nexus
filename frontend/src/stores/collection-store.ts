import { create } from 'zustand'
import type { Collection } from '@/types'

/**
 * 컬렉션 업데이트 가능한 필드
 */
type CollectionUpdates = Partial<Pick<Collection, 'title' | 'isExpanded'>>

/**
 * 컬렉션 검증 에러 타입
 */
class CollectionError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'CollectionError'
    this.code = code
  }
}

/**
 * 컬렉션 스토어 인터페이스
 */
interface CollectionStore {
  collections: Collection[]

  // 컬렉션 관리 액션
  addCollection: (_title: string) => Collection
  removeCollection: (_id: string) => void
  updateCollection: (_id: string, _updates: CollectionUpdates) => void
  reorderCollections: (_fromIndex: number, _toIndex: number) => void

  // 컬렉션 조회 (메모이제이션 적용)
  getCollectionById: (_id: string) => Collection | undefined
  searchCollections: (_query: string) => Collection[]
  getCollectionsByIds: (_ids: string[]) => Collection[]

  // 통계 및 유틸리티
  getCollectionCount: () => number
  isEmpty: () => boolean
  hasCollection: (_id: string) => boolean

  // 스토어 관리
  reset: () => void
}

/**
 * 컬렉션 제목 검증
 */
const validateCollectionTitle = (title: string): void => {
  if (typeof title !== 'string') {
    throw new CollectionError('제목은 문자열이어야 합니다', 'INVALID_TYPE')
  }

  const trimmedTitle = title.trim()
  if (!trimmedTitle) {
    throw new CollectionError('컬렉션 제목은 필수입니다', 'REQUIRED')
  }

  if (trimmedTitle.length > 100) {
    throw new CollectionError('컬렉션 제목은 100자 이하여야 합니다', 'TOO_LONG')
  }
}

/**
 * ID 검증
 */
const validateId = (id: string, fieldName = 'ID'): void => {
  if (typeof id !== 'string' || !id.trim()) {
    throw new CollectionError(`유효한 ${fieldName}가 필요합니다`, 'INVALID_ID')
  }
}

/**
 * 인덱스 범위 검증
 */
const validateIndexRange = (index: number, length: number): void => {
  if (!Number.isInteger(index) || index < 0 || index >= length) {
    throw new CollectionError('유효하지 않은 인덱스입니다', 'INVALID_INDEX')
  }
}

/**
 * UUID 생성 (crypto API 사용)
 */
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for older environments
  return 'col-' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const initialState = {
  collections: [] as Collection[],
}

// 캐시를 위한 Map (메모리 효율성)
const collectionCache = new Map<string, Collection>()
const searchCache = new Map<string, Collection[]>()

export const useCollectionStore = create<CollectionStore>()((set, get) => ({
    ...initialState,

    /**
     * 새 컬렉션 추가
     */
    addCollection: (title: string): Collection => {
      validateCollectionTitle(title)

      const { collections } = get()
      const trimmedTitle = title.trim()

      // 중복 제목 검사 (성능 최적화: Map 사용)
      const titleMap = new Map(collections.map((c: Collection) => [c.title.toLowerCase(), c]))
      if (titleMap.has(trimmedTitle.toLowerCase())) {
        throw new CollectionError('동일한 제목의 컬렉션이 이미 존재합니다', 'DUPLICATE_TITLE')
      }

      const now = Date.now()
      const newCollection: Collection = {
        id: generateId(),
        title: trimmedTitle,
        isExpanded: false,
        sortOrder: collections.length,
        createdAt: now,
        updatedAt: now,
      }

      set({ collections: [...collections, newCollection] })

      // 캐시 무효화
      collectionCache.clear()
      searchCache.clear()

      return newCollection
    },

    /**
     * 컬렉션 삭제
     */
    removeCollection: (id: string): void => {
      validateId(id, '컬렉션 ID')

      const { collections } = get()
      const collectionIndex = collections.findIndex((c: Collection) => c.id === id)

      if (collectionIndex === -1) {
        throw new CollectionError('컬렉션을 찾을 수 없습니다', 'NOT_FOUND')
      }

      const newCollections = collections.filter((collection: Collection) => collection.id !== id)

      // sortOrder 재정렬
      const reorderedCollections = newCollections.map((collection: Collection, index: number) => ({
        ...collection,
        sortOrder: index,
      }))

      set({ collections: reorderedCollections })

      // 캐시 무효화
      collectionCache.clear()
      searchCache.clear()
    },

    /**
     * 컬렉션 순서 변경 (드래그 앤 드롭)
     */
    reorderCollections: (fromIndex: number, toIndex: number): void => {
      const { collections } = get()

      validateIndexRange(fromIndex, collections.length)
      validateIndexRange(toIndex, collections.length)

      if (fromIndex === toIndex) return // 같은 위치로 이동 시 무시

      const newCollections = [...collections]
      const [movedCollection] = newCollections.splice(fromIndex, 1)
      newCollections.splice(toIndex, 0, movedCollection)

      // sortOrder 업데이트 및 타임스탬프 갱신
      const now = Date.now()
      const updatedCollections = newCollections.map((collection: Collection, index: number) => ({
        ...collection,
        sortOrder: index,
        updatedAt: now,
      }))

      set({ collections: updatedCollections })

      // 캐시 무효화
      collectionCache.clear()
    },

    /**
     * 컬렉션 수정
     */
    updateCollection: (id: string, updates: CollectionUpdates): void => {
      validateId(id, '컬렉션 ID')

      const { collections } = get()
      const collectionIndex = collections.findIndex((c: Collection) => c.id === id)

      if (collectionIndex === -1) {
        throw new CollectionError('컬렉션을 찾을 수 없습니다', 'NOT_FOUND')
      }

      // 제목 검증 및 중복 검사
      if (updates.title !== undefined) {
        validateCollectionTitle(updates.title)
        const trimmedTitle = updates.title.trim()

        // 중복 제목 검사 (본인 제외)
        const isDuplicate = collections.some((collection: Collection, index: number) =>
          index !== collectionIndex && collection.title.toLowerCase() === trimmedTitle.toLowerCase()
        )

        if (isDuplicate) {
          throw new CollectionError('동일한 제목의 컬렉션이 이미 존재합니다', 'DUPLICATE_TITLE')
        }
      }

      const updatedCollections = collections.map((collection: Collection) =>
        collection.id === id
          ? { ...collection, ...updates, updatedAt: Date.now() }
          : collection
      )

      set({ collections: updatedCollections })

      // 캐시 무효화
      collectionCache.delete(id)
      searchCache.clear()
    },

    /**
     * ID로 컬렉션 조회 (캐시 적용)
     */
    getCollectionById: (id: string): Collection | undefined => {
      validateId(id, '컬렉션 ID')

      if (collectionCache.has(id)) {
        return collectionCache.get(id)
      }

      const { collections } = get()
      const collection = collections.find((c: Collection) => c.id === id)

      if (collection) {
        collectionCache.set(id, collection)
      }

      return collection
    },

    /**
     * 제목으로 컬렉션 검색 (캐시 적용)
     */
    searchCollections: (query: string): Collection[] => {
      if (typeof query !== 'string' || !query.trim()) return []

      const trimmedQuery = query.trim().toLowerCase()
      const cacheKey = `search:${trimmedQuery}`

      if (searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey) ?? []
      }

      const { collections } = get()
      const results = collections.filter((collection: Collection) =>
        collection.title.toLowerCase().includes(trimmedQuery)
      )

      searchCache.set(cacheKey, results)
      return results
    },

    /**
     * 다중 ID로 컬렉션 조회 (배치 처리)
     */
    getCollectionsByIds: (ids: string[]): Collection[] => {
      if (!Array.isArray(ids)) return []

      const { collections } = get()
      const idSet = new Set(ids)

      return collections.filter((collection: Collection) => idSet.has(collection.id))
    },

    /**
     * 컬렉션 개수 반환
     */
    getCollectionCount: (): number => {
      return get().collections.length
    },

    /**
     * 컬렉션 목록이 비어있는지 확인
     */
    isEmpty: (): boolean => {
      return get().collections.length === 0
    },

    /**
     * 특정 컬렉션이 존재하는지 확인
     */
    hasCollection: (id: string): boolean => {
      validateId(id, '컬렉션 ID')
      return get().collections.some((c: Collection) => c.id === id)
    },

    /**
     * 스토어 초기화
     */
    reset: (): void => {
      set(initialState)
      collectionCache.clear()
      searchCache.clear()
    },
  }))