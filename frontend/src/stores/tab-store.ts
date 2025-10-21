import { create } from 'zustand'
import type { Tab, TabInput } from '@/types'
import {
  validateTabInput,
  validateTabTitle,
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

    // 성능 최적화: 삭제할 탭보다 높은 sortOrder를 가진 같은 컬렉션 탭들만 처리
    const updatedTabs: Tab[] = []
    const now = new Date()
    let reorderNeeded = false

    for (const tab of tabs) {
      if (tab.id === id) {
        continue // 삭제할 탭은 제외
      }

      if (tab.collectionId === removedTab.collectionId && tab.sortOrder > removedTab.sortOrder) {
        // 재정렬이 필요한 탭
        updatedTabs.push({
          ...tab,
          sortOrder: tab.sortOrder - 1,
          updatedAt: now
        })
        reorderNeeded = true
      } else {
        // 변경 불필요한 탭
        updatedTabs.push(tab)
      }
    }

    set({ tabs: updatedTabs })

    // 캐시 무효화 (재정렬이 있었던 경우에만 전체 무효화)
    if (reorderNeeded) {
      cacheManager.clearAll()
    } else {
      cacheManager.clearTab(id)
    }
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

    // 업데이트할 필드들을 전처리하고 검증
    const processedUpdates: Partial<Tab> = {}

    // 제목 검증 및 트림 처리
    if (updates.title !== undefined) {
      const trimmedTitle = updates.title.trim()
      validateTabTitle(trimmedTitle)
      processedUpdates.title = trimmedTitle
    }

    // URL 검증 및 중복 검사
    if (updates.url !== undefined && updates.url !== existingTab.url) {
      const otherTabs = tabs.filter(tab => tab.id !== id)
      const updateInput = { url: updates.url, type: existingTab.type }

      validateByTabType(updateInput, existingTab.collectionId, otherTabs)
      processedUpdates.url = updates.url
    }

    // 기타 필드들 처리
    if (updates.description !== undefined) {
      processedUpdates.description = updates.description
    }

    if (updates.noteContent !== undefined) {
      processedUpdates.noteContent = updates.noteContent
    }

    if (updates.tags !== undefined) {
      processedUpdates.tags = updates.tags
    }

    // 실제 변경사항이 있는지 확인 (성능 최적화)
    const hasChanges = Object.keys(processedUpdates).length > 0

    if (!hasChanges) {
      return // 변경사항이 없으면 조기 반환
    }

    // 성능 최적화: 배열 복사 후 직접 수정 (map 대신)
    const updatedTabs = [...tabs]
    updatedTabs[tabIndex] = {
      ...existingTab,
      ...processedUpdates,
      updatedAt: new Date()
    }

    set({ tabs: updatedTabs })

    // 캐시 무효화
    cacheManager.clearTab(id)
    cacheManager.clearSearch()
  },

  /**
   * 탭 이동 (드래그앤드롭)
   */
  moveTab: (tabId: string, fromIndex: number, toIndex: number): void => {
    if (fromIndex === toIndex) return

    const { tabs } = get()

    // 탭 존재 여부 확인
    const targetTab = tabs.find(tab => tab.id === tabId)
    if (!targetTab) {
      throw new TabValidationError('이동할 탭을 찾을 수 없습니다', TAB_ERROR_CODES.NOT_FOUND)
    }

    // 전체 배열에서 직접 이동 (기존 테스트 호환성 유지)
    const newTabs = [...tabs]
    const [movedTab] = newTabs.splice(fromIndex, 1)
    newTabs.splice(toIndex, 0, movedTab)

    // 성능 최적화: sortOrder 업데이트 (변경된 탭들만)
    const now = new Date()
    const minIndex = Math.min(fromIndex, toIndex)
    const maxIndex = Math.max(fromIndex, toIndex)

    const updatedTabs = newTabs.map((tab, index) => {
      // 영향받은 범위의 탭들만 업데이트
      if (index >= minIndex && index <= maxIndex) {
        return {
          ...tab,
          sortOrder: index,
          updatedAt: now
        }
      }
      // 범위 밖 탭들은 sortOrder만 업데이트 (updatedAt은 변경하지 않음)
      else if (tab.sortOrder !== index) {
        return {
          ...tab,
          sortOrder: index
        }
      }
      return tab
    })

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
   * 탭 검색 (제목, URL, 설명, 노트내용, 태그에서 검색)
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

    // 검색 대상 필드와 가중치 설정 (관련성 기반 정렬용)
    const searchableFields = [
      { field: 'title', weight: 3 },          // 제목에서 매칭 시 높은 가중치
      { field: 'description', weight: 2 },    // 설명에서 매칭 시 중간 가중치
      { field: 'url', weight: 1 },            // URL에서 매칭 시 낮은 가중치
      { field: 'noteContent', weight: 2 },    // 노트 내용 중간 가중치
      { field: 'tags', weight: 3 }            // 태그 높은 가중치
    ]

    const resultsWithScore: Array<{ tab: Tab; score: number }> = []

    for (const tab of tabs) {
      let totalScore = 0

      for (const { field, weight } of searchableFields) {
        const fieldValue = tab[field as keyof Tab]

        if (field === 'tags' && Array.isArray(fieldValue)) {
          // 태그 배열 검색
          const matchingTags = fieldValue.filter(tag =>
            tag.toLowerCase().includes(trimmedQuery)
          )
          if (matchingTags.length > 0) {
            totalScore += weight * matchingTags.length // 매칭된 태그 수만큼 가중치 증가
          }
        } else if (fieldValue && typeof fieldValue === 'string') {
          // 문자열 필드 검색
          const lowerFieldValue = fieldValue.toLowerCase()
          if (lowerFieldValue.includes(trimmedQuery)) {
            // 정확히 일치하는 경우 더 높은 점수
            if (lowerFieldValue === trimmedQuery) {
              totalScore += weight * 2
            } else {
              totalScore += weight
            }
          }
        }
      }

      if (totalScore > 0) {
        resultsWithScore.push({ tab, score: totalScore })
      }
    }

    // 점수 기반 정렬 (높은 점수 먼저, 같은 점수면 제목 알파벳 순)
    const results = resultsWithScore
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score
        }
        return a.tab.title.localeCompare(b.tab.title)
      })
      .map(item => item.tab)

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