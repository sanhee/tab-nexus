import { describe, test, expect, beforeEach } from 'vitest'
import { useTabStore } from '@/stores/tab-store'
import type { Tab, TabInput } from '@/types'

describe('탭 스토어', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
    useTabStore.getState().reset()
  })

  describe('기본 CRUD 기능', () => {
    test('유효한 URL로 탭을 추가할 수 있다', () => {
      const { addTab, getTabsByCollection } = useTabStore.getState()
      const collectionId = 'test-collection-id'

      const tabInput: TabInput = {
        title: '구글',
        url: 'https://google.com',
        collectionId
      }

      const newTab = addTab(tabInput)
      const tabs = getTabsByCollection(collectionId)

      expect(tabs).toHaveLength(1)
      expect(tabs[0].url).toBe('https://google.com')
      expect(tabs[0].title).toBe('구글')
      expect(newTab.id).toBeDefined()
      expect(newTab.createdAt).toBeInstanceOf(Date)
    })

    test('잘못된 URL 형식일 때 오류가 발생한다', () => {
      const { addTab } = useTabStore.getState()

      const invalidTabInput: TabInput = {
        title: '잘못된 사이트',
        url: 'invalid-url',
        collectionId: 'test-id'
      }

      expect(() => {
        addTab(invalidTabInput)
      }).toThrow('올바른 URL 형식이 아닙니다')
    })

    test('빈 제목으로는 탭을 생성할 수 없다', () => {
      const { addTab } = useTabStore.getState()

      const emptyTitleInput: TabInput = {
        title: '',
        url: 'https://google.com',
        collectionId: 'test-id'
      }

      expect(() => {
        addTab(emptyTitleInput)
      }).toThrow('탭 제목은 필수입니다')
    })

    test('존재하지 않는 컬렉션 ID로는 탭을 생성할 수 없다', () => {
      const { addTab } = useTabStore.getState()

      const invalidCollectionInput: TabInput = {
        title: '테스트 탭',
        url: 'https://google.com',
        collectionId: ''
      }

      expect(() => {
        addTab(invalidCollectionInput)
      }).toThrow('유효한 컬렉션 ID가 필요합니다')
    })

    test('탭 목록을 조회할 수 있다', () => {
      const { addTab, getAllTabs } = useTabStore.getState()

      const tab1Input: TabInput = {
        title: '첫 번째 탭',
        url: 'https://first.com',
        collectionId: 'collection1'
      }

      const tab2Input: TabInput = {
        title: '두 번째 탭',
        url: 'https://second.com',
        collectionId: 'collection2'
      }

      addTab(tab1Input)
      addTab(tab2Input)

      const allTabs = getAllTabs()
      expect(allTabs).toHaveLength(2)
    })

    test('컬렉션별 탭을 조회할 수 있다', () => {
      const { addTab, getTabsByCollection } = useTabStore.getState()
      const collectionId = 'test-collection'

      const tab1Input: TabInput = {
        title: '같은 컬렉션 탭 1',
        url: 'https://same1.com',
        collectionId
      }

      const tab2Input: TabInput = {
        title: '같은 컬렉션 탭 2',
        url: 'https://same2.com',
        collectionId
      }

      const tab3Input: TabInput = {
        title: '다른 컬렉션 탭',
        url: 'https://different.com',
        collectionId: 'other-collection'
      }

      addTab(tab1Input)
      addTab(tab2Input)
      addTab(tab3Input)

      const sameTabs = getTabsByCollection(collectionId)
      const otherTabs = getTabsByCollection('other-collection')

      expect(sameTabs).toHaveLength(2)
      expect(otherTabs).toHaveLength(1)
      expect(sameTabs[0].collectionId).toBe(collectionId)
      expect(sameTabs[1].collectionId).toBe(collectionId)
    })

    test('ID로 탭을 조회할 수 있다', () => {
      const { addTab, getTabById } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '조회할 탭',
        url: 'https://findme.com',
        collectionId: 'test-collection'
      }

      const newTab = addTab(tabInput)
      const foundTab = getTabById(newTab.id)

      expect(foundTab).toBeDefined()
      expect(foundTab!.title).toBe('조회할 탭')
      expect(foundTab!.url).toBe('https://findme.com')
    })

    test('존재하지 않는 ID로 조회하면 undefined를 반환한다', () => {
      const { getTabById } = useTabStore.getState()

      const notFoundTab = getTabById('non-existent-id')
      expect(notFoundTab).toBeUndefined()
    })

    test('스토어를 초기화할 수 있다', () => {
      const { addTab, getAllTabs, reset } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '테스트 탭',
        url: 'https://test.com',
        collectionId: 'test-collection'
      }

      // 탭 추가
      addTab(tabInput)
      expect(getAllTabs()).toHaveLength(1)

      // 스토어 초기화
      reset()
      expect(getAllTabs()).toHaveLength(0)
    })
  })
})