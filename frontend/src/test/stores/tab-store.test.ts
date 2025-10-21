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

  describe('고급 탭 추가 기능', () => {
    test('노트 타입 탭을 추가할 수 있다', () => {
      const { addTab, getTabById } = useTabStore.getState()

      const noteTabInput: TabInput = {
        title: '개발 노트',
        url: '', // 노트 타입은 빈 URL 허용
        collectionId: 'notes-collection',
        type: 'note',
        noteContent: '# 개발 노트\n\n오늘의 학습 내용...'
      }

      const newTab = addTab(noteTabInput)
      const savedTab = getTabById(newTab.id)

      expect(savedTab).toBeDefined()
      expect(savedTab!.type).toBe('note')
      expect(savedTab!.noteContent).toBe('# 개발 노트\n\n오늘의 학습 내용...')
      expect(savedTab!.url).toBe('')
    })

    test('중복된 URL로는 같은 컬렉션에 탭을 추가할 수 없다', () => {
      const { addTab } = useTabStore.getState()
      const collectionId = 'test-collection'

      const firstTab: TabInput = {
        title: '첫 번째 구글',
        url: 'https://google.com',
        collectionId
      }

      const duplicateTab: TabInput = {
        title: '두 번째 구글',
        url: 'https://google.com',
        collectionId
      }

      // 첫 번째 탭 추가는 성공
      addTab(firstTab)

      // 같은 URL로 두 번째 탭 추가는 실패
      expect(() => {
        addTab(duplicateTab)
      }).toThrow('같은 컬렉션에 동일한 URL이 이미 존재합니다')
    })

    test('다른 컬렉션에는 같은 URL을 추가할 수 있다', () => {
      const { addTab, getTabsByCollection } = useTabStore.getState()

      const tab1: TabInput = {
        title: '컬렉션1의 구글',
        url: 'https://google.com',
        collectionId: 'collection1'
      }

      const tab2: TabInput = {
        title: '컬렉션2의 구글',
        url: 'https://google.com',
        collectionId: 'collection2'
      }

      addTab(tab1)
      addTab(tab2)

      const collection1Tabs = getTabsByCollection('collection1')
      const collection2Tabs = getTabsByCollection('collection2')

      expect(collection1Tabs).toHaveLength(1)
      expect(collection2Tabs).toHaveLength(1)
    })

    test('탭에 태그를 추가할 수 있다', () => {
      const { addTab, getTabById } = useTabStore.getState()

      const tabWithTags: TabInput = {
        title: '태그가 있는 탭',
        url: 'https://example.com',
        collectionId: 'test-collection',
        tags: ['개발', '학습', 'React']
      }

      const newTab = addTab(tabWithTags)
      const savedTab = getTabById(newTab.id)

      expect(savedTab!.tags).toEqual(['개발', '학습', 'React'])
    })

    test('탭 추가 시 sortOrder가 자동으로 설정된다', () => {
      const { addTab, getTabsByCollection } = useTabStore.getState()
      const collectionId = 'order-test'

      const tab1: TabInput = {
        title: '첫 번째 탭',
        url: 'https://first.com',
        collectionId
      }

      const tab2: TabInput = {
        title: '두 번째 탭',
        url: 'https://second.com',
        collectionId
      }

      const tab3: TabInput = {
        title: '세 번째 탭',
        url: 'https://third.com',
        collectionId
      }

      addTab(tab1)
      addTab(tab2)
      addTab(tab3)

      const tabs = getTabsByCollection(collectionId)

      expect(tabs[0].sortOrder).toBe(0)
      expect(tabs[1].sortOrder).toBe(1)
      expect(tabs[2].sortOrder).toBe(2)
    })

    test('탭 제목이 자동으로 트림된다', () => {
      const { addTab, getTabById } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '  공백이 있는 제목  ',
        url: 'https://example.com',
        collectionId: 'test-collection'
      }

      const newTab = addTab(tabInput)
      const savedTab = getTabById(newTab.id)

      expect(savedTab!.title).toBe('공백이 있는 제목')
    })

    test('URL 정규화가 올바르게 작동한다', () => {
      const { addTab, getTabById } = useTabStore.getState()

      const tabInput: TabInput = {
        title: 'HTTP 사이트',
        url: 'http://example.com',
        collectionId: 'test-collection'
      }

      const newTab = addTab(tabInput)
      const savedTab = getTabById(newTab.id)

      expect(savedTab!.url).toBe('http://example.com')
    })
  })

  describe('탭 수정 기능', () => {
    test('탭 제목을 수정할 수 있다', async () => {
      const { addTab, updateTab, getTabById } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '원래 제목',
        url: 'https://example.com',
        collectionId: 'test-collection'
      }

      const newTab = addTab(tabInput)

      // 시간 차이를 보장하기 위해 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1))

      updateTab(newTab.id, { title: '수정된 제목' })

      const updatedTab = getTabById(newTab.id)
      expect(updatedTab!.title).toBe('수정된 제목')
      expect(updatedTab!.updatedAt).not.toEqual(newTab.createdAt)
    })

    test('탭 URL을 수정할 수 있다', () => {
      const { addTab, updateTab, getTabById } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '테스트 탭',
        url: 'https://original.com',
        collectionId: 'test-collection'
      }

      const newTab = addTab(tabInput)
      updateTab(newTab.id, { url: 'https://updated.com' })

      const updatedTab = getTabById(newTab.id)
      expect(updatedTab!.url).toBe('https://updated.com')
    })

    test('잘못된 URL로 수정할 수 없다', () => {
      const { addTab, updateTab } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '테스트 탭',
        url: 'https://original.com',
        collectionId: 'test-collection'
      }

      const newTab = addTab(tabInput)

      expect(() => {
        updateTab(newTab.id, { url: 'invalid-url' })
      }).toThrow('올바른 URL 형식이 아닙니다')
    })

    test('중복된 URL로 수정할 수 없다', () => {
      const { addTab, updateTab } = useTabStore.getState()
      const collectionId = 'test-collection'

      const tab1Input: TabInput = {
        title: '첫 번째 탭',
        url: 'https://first.com',
        collectionId
      }

      const tab2Input: TabInput = {
        title: '두 번째 탭',
        url: 'https://second.com',
        collectionId
      }

      addTab(tab1Input)
      const tab2 = addTab(tab2Input)

      expect(() => {
        updateTab(tab2.id, { url: 'https://first.com' })
      }).toThrow('같은 컬렉션에 동일한 URL이 이미 존재합니다')
    })

    test('노트 타입 탭은 빈 URL로 수정할 수 있다', () => {
      const { addTab, updateTab, getTabById } = useTabStore.getState()

      const noteTabInput: TabInput = {
        title: '노트 탭',
        url: 'https://example.com',
        collectionId: 'test-collection',
        type: 'note'
      }

      const noteTab = addTab(noteTabInput)
      updateTab(noteTab.id, { url: '' })

      const updatedTab = getTabById(noteTab.id)
      expect(updatedTab!.url).toBe('')
    })

    test('탭 설명을 수정할 수 있다', () => {
      const { addTab, updateTab, getTabById } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '테스트 탭',
        url: 'https://example.com',
        collectionId: 'test-collection'
      }

      const newTab = addTab(tabInput)
      updateTab(newTab.id, { description: '새로운 설명' })

      const updatedTab = getTabById(newTab.id)
      expect(updatedTab!.description).toBe('새로운 설명')
    })

    test('노트 내용을 수정할 수 있다', () => {
      const { addTab, updateTab, getTabById } = useTabStore.getState()

      const noteTabInput: TabInput = {
        title: '노트 탭',
        url: '',
        collectionId: 'test-collection',
        type: 'note',
        noteContent: '# 원래 내용'
      }

      const noteTab = addTab(noteTabInput)
      updateTab(noteTab.id, { noteContent: '# 수정된 내용\n\n새로운 섹션' })

      const updatedTab = getTabById(noteTab.id)
      expect(updatedTab!.noteContent).toBe('# 수정된 내용\n\n새로운 섹션')
    })

    test('탭 태그를 수정할 수 있다', () => {
      const { addTab, updateTab, getTabById } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '태그 탭',
        url: 'https://example.com',
        collectionId: 'test-collection',
        tags: ['원래', '태그']
      }

      const newTab = addTab(tabInput)
      updateTab(newTab.id, { tags: ['수정된', '태그', '목록'] })

      const updatedTab = getTabById(newTab.id)
      expect(updatedTab!.tags).toEqual(['수정된', '태그', '목록'])
    })

    test('존재하지 않는 탭을 수정하려 하면 오류가 발생한다', () => {
      const { updateTab } = useTabStore.getState()

      expect(() => {
        updateTab('non-existent-id', { title: '수정된 제목' })
      }).toThrow('탭을 찾을 수 없습니다')
    })

    test('여러 필드를 동시에 수정할 수 있다', () => {
      const { addTab, updateTab, getTabById } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '원래 제목',
        url: 'https://original.com',
        collectionId: 'test-collection',
        description: '원래 설명',
        tags: ['원래']
      }

      const newTab = addTab(tabInput)
      updateTab(newTab.id, {
        title: '수정된 제목',
        url: 'https://updated.com',
        description: '수정된 설명',
        tags: ['수정된', '태그']
      })

      const updatedTab = getTabById(newTab.id)
      expect(updatedTab!.title).toBe('수정된 제목')
      expect(updatedTab!.url).toBe('https://updated.com')
      expect(updatedTab!.description).toBe('수정된 설명')
      expect(updatedTab!.tags).toEqual(['수정된', '태그'])
    })

    test('탭 수정 시 제목이 트림된다', () => {
      const { addTab, updateTab, getTabById } = useTabStore.getState()

      const tabInput: TabInput = {
        title: '원래 제목',
        url: 'https://example.com',
        collectionId: 'test-collection'
      }

      const newTab = addTab(tabInput)
      updateTab(newTab.id, { title: '  공백이 있는 제목  ' })

      const updatedTab = getTabById(newTab.id)
      expect(updatedTab!.title).toBe('공백이 있는 제목')
    })
  })
})