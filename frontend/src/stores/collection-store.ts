import { create } from 'zustand'
import { Collection } from '@/types'

interface CollectionStore {
  collections: Collection[]

  // 컬렉션 추가
  addCollection: (title: string) => Collection

  // 컬렉션 삭제
  removeCollection: (id: string) => void

  // 컬렉션 순서 변경
  reorderCollections: (fromIndex: number, toIndex: number) => void

  // 컬렉션 수정
  updateCollection: (id: string, updates: Partial<Pick<Collection, 'title'>>) => void

  // 컬렉션 검색
  getCollectionById: (id: string) => Collection | undefined
  searchCollections: (query: string) => Collection[]

  // 통계
  getCollectionCount: () => number

  // 스토어 초기화
  reset: () => void
}

const initialState = {
  collections: [] as Collection[],
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  ...initialState,

  addCollection: (title: string): Collection => {
    // 제목 검증
    if (!title.trim()) {
      throw new Error('컬렉션 제목은 필수입니다')
    }

    if (title.length > 100) {
      throw new Error('컬렉션 제목은 100자 이하여야 합니다')
    }

    const { collections } = get()

    // 중복 제목 검사
    const isDuplicate = collections.some(collection => collection.title === title)
    if (isDuplicate) {
      throw new Error('동일한 제목의 컬렉션이 이미 존재합니다')
    }

    const now = new Date()
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      title,
      isExpanded: false,
      sortOrder: collections.length,
      createdAt: now,
      updatedAt: now,
    }

    set({ collections: [...collections, newCollection] })
    return newCollection
  },

  removeCollection: (id: string): void => {
    if (!id.trim()) {
      throw new Error('유효한 컬렉션 ID가 필요합니다')
    }

    const { collections } = get()
    const collectionExists = collections.some(collection => collection.id === id)

    if (!collectionExists) {
      throw new Error('컬렉션을 찾을 수 없습니다')
    }

    set({
      collections: collections.filter(collection => collection.id !== id)
    })
  },

  reorderCollections: (fromIndex: number, toIndex: number): void => {
    const { collections } = get()

    // 인덱스 유효성 검사
    if (fromIndex < 0 || fromIndex >= collections.length ||
        toIndex < 0 || toIndex >= collections.length) {
      throw new Error('유효하지 않은 인덱스입니다')
    }

    const newCollections = [...collections]
    const [movedItem] = newCollections.splice(fromIndex, 1)
    newCollections.splice(toIndex, 0, movedItem)

    // sortOrder 업데이트
    const updatedCollections = newCollections.map((collection, index) => ({
      ...collection,
      sortOrder: index,
      updatedAt: new Date()
    }))

    set({ collections: updatedCollections })
  },

  updateCollection: (id: string, updates: Partial<Pick<Collection, 'title'>>): void => {
    const { collections } = get()
    const collectionIndex = collections.findIndex(collection => collection.id === id)

    if (collectionIndex === -1) {
      throw new Error('컬렉션을 찾을 수 없습니다')
    }

    // 제목 업데이트 시 검증
    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        throw new Error('컬렉션 제목은 필수입니다')
      }

      if (updates.title.length > 100) {
        throw new Error('컬렉션 제목은 100자 이하여야 합니다')
      }

      // 중복 제목 검사 (본인 제외)
      const isDuplicate = collections.some((collection, index) =>
        index !== collectionIndex && collection.title === updates.title
      )
      if (isDuplicate) {
        throw new Error('동일한 제목의 컬렉션이 이미 존재합니다')
      }
    }

    const updatedCollections = collections.map(collection =>
      collection.id === id
        ? { ...collection, ...updates, updatedAt: new Date() }
        : collection
    )

    set({ collections: updatedCollections })
  },

  getCollectionById: (id: string): Collection | undefined => {
    const { collections } = get()
    return collections.find(collection => collection.id === id)
  },

  searchCollections: (query: string): Collection[] => {
    const { collections } = get()
    if (!query.trim()) return []

    const lowercaseQuery = query.toLowerCase()
    return collections.filter(collection =>
      collection.title.toLowerCase().includes(lowercaseQuery)
    )
  },

  getCollectionCount: (): number => {
    const { collections } = get()
    return collections.length
  },

  reset: (): void => {
    set(initialState)
  },
}))