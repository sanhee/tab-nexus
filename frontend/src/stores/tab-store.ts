import { create } from 'zustand'
import type { Tab, TabInput } from '@/types'

/**
 * 탭 업데이트 가능한 필드
 */
type TabUpdates = Partial<Pick<Tab, 'title' | 'url' | 'description' | 'noteContent' | 'tags'>>

/**
 * 탭 검증 에러 타입
 */
class TabError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'TabError'
    this.code = code
  }
}

/**
 * 탭 스토어 인터페이스
 */
interface TabStore {
  tabs: Tab[]

  // 탭 관리 액션
  addTab: (_input: TabInput) => Tab
  removeTab: (_id: string) => void
  updateTab: (_id: string, _updates: TabUpdates) => void
  moveTab: (_tabId: string, _fromIndex: number, _toIndex: number) => void

  // 탭 조회 (메모이제이션 적용)
  getTabById: (_id: string) => Tab | undefined
  getTabsByCollection: (_collectionId: string) => Tab[]
  getAllTabs: () => Tab[]
  searchTabs: (_query: string) => Tab[]

  // 통계 및 유틸리티
  getTabCount: () => number
  isEmpty: () => boolean
  hasTab: (_id: string) => boolean

  // 스토어 관리
  reset: () => void
}

/**
 * 탭 제목 검증
 */
const validateTabTitle = (title: string): void => {
  if (typeof title !== 'string') {
    throw new TabError('제목은 문자열이어야 합니다', 'INVALID_TYPE')
  }

  const trimmedTitle = title.trim()
  if (!trimmedTitle) {
    throw new TabError('탭 제목은 필수입니다', 'REQUIRED')
  }

  if (trimmedTitle.length > 200) {
    throw new TabError('탭 제목은 200자 이하여야 합니다', 'TOO_LONG')
  }
}

/**
 * URL 검증
 */
const validateUrl = (url: string): void => {
  if (typeof url !== 'string' || !url.trim()) {
    throw new TabError('유효한 URL이 필요합니다', 'INVALID_URL')
  }

  try {
    new URL(url)
  } catch {
    throw new TabError('올바른 URL 형식이 아닙니다', 'INVALID_URL_FORMAT')
  }
}

/**
 * 컬렉션 ID 검증
 */
const validateCollectionId = (collectionId: string): void => {
  if (typeof collectionId !== 'string' || !collectionId.trim()) {
    throw new TabError('유효한 컬렉션 ID가 필요합니다', 'INVALID_COLLECTION_ID')
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
  return 'tab-' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const initialState = {
  tabs: [] as Tab[],
}

// 캐시를 위한 Map (메모리 효율성)
const tabCache = new Map<string, Tab>()
const searchCache = new Map<string, Tab[]>()

export const useTabStore = create<TabStore>()((set, get) => ({
  ...initialState,

  /**
   * 새 탭 추가
   */
  addTab: (input: TabInput): Tab => {
    validateTabTitle(input.title)
    validateUrl(input.url)
    validateCollectionId(input.collectionId)

    const { tabs } = get()
    const now = new Date()

    // 해당 컬렉션의 탭 개수로 sortOrder 결정
    const collectionTabs = tabs.filter(tab => tab.collectionId === input.collectionId)

    const newTab: Tab = {
      id: generateId(),
      title: input.title.trim(),
      url: input.url,
      collectionId: input.collectionId,
      sortOrder: collectionTabs.length,
      type: input.type || 'link',
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
      favicon: undefined,
      description: input.description,
      noteContent: input.noteContent,
      lastVisited: undefined
    }

    set({ tabs: [...tabs, newTab] })

    // 캐시 무효화
    tabCache.clear()
    searchCache.clear()

    return newTab
  },

  /**
   * 탭 삭제
   */
  removeTab: (id: string): void => {
    const { tabs } = get()
    const tabIndex = tabs.findIndex(tab => tab.id === id)

    if (tabIndex === -1) {
      throw new TabError('탭을 찾을 수 없습니다', 'NOT_FOUND')
    }

    const removedTab = tabs[tabIndex]
    const newTabs = tabs.filter(tab => tab.id !== id)

    // 같은 컬렉션의 탭들의 sortOrder 재정렬
    const reorderedTabs = newTabs.map(tab => {
      if (tab.collectionId === removedTab.collectionId && tab.sortOrder > removedTab.sortOrder) {
        return {
          ...tab,
          sortOrder: tab.sortOrder - 1,
          updatedAt: new Date()
        }
      }
      return tab
    })

    set({ tabs: reorderedTabs })

    // 캐시 무효화
    tabCache.clear()
    searchCache.clear()
  },

  /**
   * 탭 수정
   */
  updateTab: (id: string, updates: TabUpdates): void => {
    const { tabs } = get()
    const tabIndex = tabs.findIndex(tab => tab.id === id)

    if (tabIndex === -1) {
      throw new TabError('탭을 찾을 수 없습니다', 'NOT_FOUND')
    }

    // 제목 검증
    if (updates.title !== undefined) {
      validateTabTitle(updates.title)
    }

    // URL 검증
    if (updates.url !== undefined) {
      validateUrl(updates.url)
    }

    const updatedTabs = tabs.map(tab =>
      tab.id === id
        ? { ...tab, ...updates, updatedAt: new Date() }
        : tab
    )

    set({ tabs: updatedTabs })

    // 캐시 무효화
    tabCache.delete(id)
    searchCache.clear()
  },

  /**
   * 탭 이동 (드래그앤드롭)
   */
  moveTab: (tabId: string, fromIndex: number, toIndex: number): void => {
    const { tabs } = get()

    if (fromIndex === toIndex) return

    const newTabs = [...tabs]
    const [movedTab] = newTabs.splice(fromIndex, 1)
    newTabs.splice(toIndex, 0, movedTab)

    // sortOrder 업데이트
    const now = new Date()
    const updatedTabs = newTabs.map((tab, index) => ({
      ...tab,
      sortOrder: index,
      updatedAt: now,
    }))

    set({ tabs: updatedTabs })

    // 캐시 무효화
    tabCache.clear()
  },

  /**
   * ID로 탭 조회 (캐시 적용)
   */
  getTabById: (id: string): Tab | undefined => {
    if (tabCache.has(id)) {
      return tabCache.get(id)
    }

    const { tabs } = get()
    const tab = tabs.find(t => t.id === id)

    if (tab) {
      tabCache.set(id, tab)
    }

    return tab
  },

  /**
   * 컬렉션별 탭 조회
   */
  getTabsByCollection: (collectionId: string): Tab[] => {
    const { tabs } = get()
    return tabs
      .filter(tab => tab.collectionId === collectionId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  },

  /**
   * 전체 탭 조회
   */
  getAllTabs: (): Tab[] => {
    return get().tabs
  },

  /**
   * 탭 검색 (제목, URL, 설명에서 검색)
   */
  searchTabs: (query: string): Tab[] => {
    if (typeof query !== 'string' || !query.trim()) return []

    const trimmedQuery = query.trim().toLowerCase()
    const cacheKey = `search:${trimmedQuery}`

    if (searchCache.has(cacheKey)) {
      return searchCache.get(cacheKey) ?? []
    }

    const { tabs } = get()
    const results = tabs.filter(tab =>
      tab.title.toLowerCase().includes(trimmedQuery) ||
      tab.url.toLowerCase().includes(trimmedQuery) ||
      (tab.description && tab.description.toLowerCase().includes(trimmedQuery))
    )

    searchCache.set(cacheKey, results)
    return results
  },

  /**
   * 탭 개수 반환
   */
  getTabCount: (): number => {
    return get().tabs.length
  },

  /**
   * 탭 목록이 비어있는지 확인
   */
  isEmpty: (): boolean => {
    return get().tabs.length === 0
  },

  /**
   * 특정 탭이 존재하는지 확인
   */
  hasTab: (id: string): boolean => {
    return get().tabs.some(tab => tab.id === id)
  },

  /**
   * 스토어 초기화
   */
  reset: (): void => {
    set(initialState)
    tabCache.clear()
    searchCache.clear()
  },
}))