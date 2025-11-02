import { describe, test, expect, beforeEach } from 'vitest'
import { useCollectionStore } from '@/stores/collection-store'

describe('컬렉션 스토어', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
    useCollectionStore.getState().reset()
  })

  describe('컬렉션 추가', () => {
    test('새로운 컬렉션을 추가할 수 있어야 한다', () => {
      const store = useCollectionStore.getState()
      const newCollection = store.addCollection('새 컬렉션')

      const { collections } = useCollectionStore.getState()

      expect(collections).toHaveLength(1)
      expect(collections[0]).toEqual(newCollection)
      expect(newCollection.title).toBe('새 컬렉션')
      expect(newCollection.id).toBeDefined()
      expect(typeof newCollection.createdAt).toBe('number')
      expect(typeof newCollection.updatedAt).toBe('number')
      expect(newCollection.createdAt).toBeGreaterThan(0)
      expect(newCollection.updatedAt).toBeGreaterThan(0)
    })

    test('컬렉션 제목이 비어있으면 오류가 발생해야 한다', () => {
      const store = useCollectionStore.getState()

      expect(() => {
        store.addCollection('')
      }).toThrow('컬렉션 제목은 필수입니다')
    })

    test('컬렉션 제목이 100자를 초과하면 오류가 발생해야 한다', () => {
      const store = useCollectionStore.getState()
      const longTitle = 'a'.repeat(101)

      expect(() => {
        store.addCollection(longTitle)
      }).toThrow('컬렉션 제목은 100자 이하여야 합니다')
    })

    test('중복된 컬렉션 제목으로 추가하면 오류가 발생해야 한다', () => {
      const store = useCollectionStore.getState()

      store.addCollection('중복 컬렉션')

      expect(() => {
        store.addCollection('중복 컬렉션')
      }).toThrow('동일한 제목의 컬렉션이 이미 존재합니다')
    })
  })

  describe('컬렉션 삭제', () => {
    test('존재하는 컬렉션을 삭제할 수 있어야 한다', () => {
      const store = useCollectionStore.getState()
      const newCollection = store.addCollection('삭제할 컬렉션')

      let collections = useCollectionStore.getState().collections
      expect(collections).toHaveLength(1)

      store.removeCollection(newCollection.id)

      collections = useCollectionStore.getState().collections
      expect(collections).toHaveLength(0)
    })

    test('존재하지 않는 컬렉션을 삭제하려 하면 오류가 발생해야 한다', () => {
      const store = useCollectionStore.getState()

      expect(() => {
        store.removeCollection('존재하지않는ID')
      }).toThrow('컬렉션을 찾을 수 없습니다')
    })

    test('빈 문자열 ID로 삭제하려 하면 오류가 발생해야 한다', () => {
      const store = useCollectionStore.getState()

      expect(() => {
        store.removeCollection('')
      }).toThrow('유효한 컬렉션 ID가 필요합니다')
    })
  })

  describe('컬렉션 순서 변경', () => {
    test('컬렉션 순서를 변경할 수 있어야 한다', () => {
      const store = useCollectionStore.getState()

      const collection1 = store.addCollection('첫번째')
      const collection2 = store.addCollection('두번째')
      const collection3 = store.addCollection('세번째')

      let collections = useCollectionStore.getState().collections
      expect(collections[0].id).toBe(collection1.id)
      expect(collections[1].id).toBe(collection2.id)
      expect(collections[2].id).toBe(collection3.id)

      // 첫 번째와 두 번째 순서 바꾸기
      store.reorderCollections(0, 1)

      collections = useCollectionStore.getState().collections
      expect(collections[0].id).toBe(collection2.id)
      expect(collections[1].id).toBe(collection1.id)
      expect(collections[2].id).toBe(collection3.id)
    })

    test('잘못된 인덱스로 순서 변경하면 오류가 발생해야 한다', () => {
      const store = useCollectionStore.getState()

      store.addCollection('테스트 컬렉션')

      expect(() => {
        store.reorderCollections(-1, 0)
      }).toThrow('유효하지 않은 인덱스입니다')

      expect(() => {
        store.reorderCollections(0, 5)
      }).toThrow('유효하지 않은 인덱스입니다')
    })
  })

  describe('컬렉션 수정', () => {
    test('컬렉션 제목을 수정할 수 있어야 한다', async () => {
      const store = useCollectionStore.getState()
      const collection = store.addCollection('원본 제목')

      // 시간 차이를 위해 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 10))

      store.updateCollection(collection.id, { title: '수정된 제목' })

      const collections = useCollectionStore.getState().collections
      expect(collections[0].title).toBe('수정된 제목')
      expect(collections[0].updatedAt).toBeGreaterThan(collection.updatedAt)
    })

    test('존재하지 않는 컬렉션을 수정하려 하면 오류가 발생해야 한다', () => {
      const store = useCollectionStore.getState()

      expect(() => {
        store.updateCollection('존재하지않는ID', { title: '새 제목' })
      }).toThrow('컬렉션을 찾을 수 없습니다')
    })
  })

  describe('컬렉션 검색', () => {
    test('ID로 컬렉션을 찾을 수 있어야 한다', () => {
      const store = useCollectionStore.getState()
      const collection = store.addCollection('찾을 컬렉션')

      const found = store.getCollectionById(collection.id)

      expect(found).toEqual(collection)
    })

    test('존재하지 않는 ID로 검색하면 undefined를 반환해야 한다', () => {
      const store = useCollectionStore.getState()

      const found = store.getCollectionById('존재하지않는ID')

      expect(found).toBeUndefined()
    })

    test('제목으로 컬렉션을 검색할 수 있어야 한다', () => {
      const store = useCollectionStore.getState()

      store.addCollection('프로젝트 탭들')
      store.addCollection('개인 북마크')
      store.addCollection('프로젝트 문서')

      const results = store.searchCollections('프로젝트')

      expect(results).toHaveLength(2)
      expect(results[0].title).toContain('프로젝트')
      expect(results[1].title).toContain('프로젝트')
    })
  })

  describe('컬렉션 통계', () => {
    test('전체 컬렉션 개수를 반환해야 한다', () => {
      const store = useCollectionStore.getState()

      expect(store.getCollectionCount()).toBe(0)

      store.addCollection('컬렉션 1')
      store.addCollection('컬렉션 2')

      expect(store.getCollectionCount()).toBe(2)
    })

    test('빈 컬렉션 목록일 때도 올바르게 처리해야 한다', () => {
      const { collections, getCollectionCount } = useCollectionStore.getState()

      expect(collections).toHaveLength(0)
      expect(getCollectionCount()).toBe(0)
    })
  })

  describe('스토어 초기화', () => {
    test('스토어를 초기 상태로 리셋할 수 있어야 한다', () => {
      const store = useCollectionStore.getState()

      store.addCollection('테스트 1')
      store.addCollection('테스트 2')

      let collections = useCollectionStore.getState().collections
      expect(collections).toHaveLength(2)

      store.reset()

      collections = useCollectionStore.getState().collections
      expect(collections).toHaveLength(0)
    })
  })
})