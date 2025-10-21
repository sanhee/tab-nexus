import { create } from 'zustand'
import type { Tab, TabInput } from '@/types'
import {
  validateTabInput,
  validateTabTitle,
  validateUrl,
  validateDuplicateUrl,
  validateByTabType,
  TabValidationError,
  TAB_ERROR_CODES
} from '@/utils/tab-validation'
import { generateId } from '@/utils/id'

/**
 * 탭 업데이트 가능한 필드
 */
type TabUpdates = Partial<Pick<Tab, 'title' | 'url' | 'description' | 'noteContent' | 'tags'>>

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
 * 탭 캐시 관리 클래스
 */
class TabCacheManager {
  private tabCache = new Map<string, Tab>()
  private searchCache = new Map<string, Tab[]>()

  getTab(id: string): Tab | undefined {
    return this.tabCache.get(id)
  }

  setTab(id: string, tab: Tab): void {
    this.tabCache.set(id, tab)
  }

  getSearchResults(query: string): Tab[] | undefined {
    return this.searchCache.get(query)
  }

  setSearchResults(query: string, results: Tab[]): void {
    this.searchCache.set(query, results)
  }

  clearTab(id: string): void {
    this.tabCache.delete(id)
  }

  clearAll(): void {
    this.tabCache.clear()
    this.searchCache.clear()
  }

  clearSearch(): void {
    this.searchCache.clear()
  }
}

const initialState = {
  tabs: [] as Tab[],
}

// 캐시 매니저 인스턴스
const cacheManager = new TabCacheManager()

export const useTabStore = create<TabStore>()((set, get) => ({
  ...initialState,

  /**
   * 새 탭 추가
   */
  addTab: (input: TabInput): Tab => {
    const { tabs } = get()

    // 기본 검증 (제목, 컬렉션ID)
    validateTabInput(input)

    // 탭 타입별 고급 검증 (URL, 중복)
    validateByTabType(input, input.collectionId, tabs)

    const now = new Date()

    // 해당 컬렉션의 탭 개수로 sortOrder 결정 (성능 최적화)
    let sortOrder = 0
    for (const tab of tabs) {
      if (tab.collectionId === input.collectionId) {
        sortOrder++
      }
    }

    const newTab: Tab = {
      id: generateId(),
      title: input.title.trim(),
      url: input.url,
      collectionId: input.collectionId,
      sortOrder,
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
    cacheManager.clearAll()

    return newTab
  },

  /**
   * 탭 삭제
   */
  removeTab: (id: string): void => {
    const { tabs } = get()
    const tabIndex = tabs.findIndex(tab => tab.id === id)

    if (tabIndex === -1) {
      throw new TabValidationError('탭을 찾을 수 없습니다', TAB_ERROR_CODES.NOT_FOUND)
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
    cacheManager.clearAll()
  },

  /**
   * 탭 수정
   */
  updateTab: (id: string, updates: TabUpdates): void => {
    const { tabs } = get()
    const tabIndex = tabs.findIndex(tab => tab.id === id)

    if (tabIndex === -1) {
      throw new TabValidationError('탭을 찾을 수 없습니다', TAB_ERROR_CODES.NOT_FOUND)
    }

    const existingTab = tabs[tabIndex]

    // 제목 검증
    if (updates.title !== undefined) {
      validateTabTitle(updates.title)
    }

    // URL 검증 및 중복 검사
    if (updates.url !== undefined && updates.url !== existingTab.url) {
      const otherTabs = tabs.filter(tab => tab.id !== id)
      const updateInput = { url: updates.url, type: existingTab.type }

      validateByTabType(updateInput, existingTab.collectionId, otherTabs)
    }

    const updatedTabs = tabs.map(tab =>
      tab.id === id
        ? { ...tab, ...updates, updatedAt: new Date() }
        : tab
    )

    set({ tabs: updatedTabs })

    // 캐시 무효화
    cacheManager.clearTab(id)
    cacheManager.clearSearch()
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
    cacheManager.clearAll()
  },

  /**
   * ID로 탭 조회 (캐시 적용)
   */
  getTabById: (id: string): Tab | undefined => {
    const cachedTab = cacheManager.getTab(id)
    if (cachedTab) {
      return cachedTab
    }

    const { tabs } = get()
    const tab = tabs.find(t => t.id === id)

    if (tab) {
      cacheManager.setTab(id, tab)
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

    const cachedResults = cacheManager.getSearchResults(cacheKey)
    if (cachedResults) {
      return cachedResults
    }

    const { tabs } = get()
    const results = tabs.filter(tab =>
      tab.title.toLowerCase().includes(trimmedQuery) ||
      tab.url.toLowerCase().includes(trimmedQuery) ||
      (tab.description && tab.description.toLowerCase().includes(trimmedQuery))
    )

    cacheManager.setSearchResults(cacheKey, results)
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
    cacheManager.clearAll()
  },
}))