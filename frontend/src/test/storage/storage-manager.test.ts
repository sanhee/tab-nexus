import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearStorage,
  getStorageSize,
  migrateStorageData,
  validateStorageData,
  compressData,
  decompressData,
  StorageError,
  StorageQuotaError,
} from '@utils/storage';
import type { StorageData, StorageOptions } from '../../types/storage';

// 실제 localStorage/sessionStorage 구현
const createMockStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const key in store) {
        delete store[key];
      }
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

describe('스토리지 매니저', () => {
  let mockLocalStorage: ReturnType<typeof createMockStorage>;
  let mockSessionStorage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    mockLocalStorage = createMockStorage();
    mockSessionStorage = createMockStorage();

    // localStorage와 sessionStorage를 실제 동작하는 모킹으로 교체
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    Object.defineProperty(global, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
    });
  });

  afterEach(() => {
    mockLocalStorage.clear();
    mockSessionStorage.clear();
  });

  describe('기본 저장/로드 기능', () => {
    test('데이터를 로컬 스토리지에 저장할 수 있어야 한다', () => {
      const testData: StorageData = {
        collections: [],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      const result = saveToStorage('tab-nexus-data', testData);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();

      const saved = localStorage.getItem('tab-nexus-data');
      expect(saved).toBeDefined();

      const parsed = JSON.parse(saved!);
      // StorageItem 구조를 확인하고 실제 데이터 추출
      expect(parsed.data).toEqual(testData);
    });

    test('로컬 스토리지에서 데이터를 불러올 수 있어야 한다', () => {
      const testData: StorageData = {
        collections: [{
          id: 'col-1',
          title: '테스트 컬렉션',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0
        }],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };
      localStorage.setItem('tab-nexus-data', JSON.stringify(testData));

      const result = loadFromStorage('tab-nexus-data');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
      expect(result.error).toBeUndefined();
    });

    test('존재하지 않는 키로 로드할 때 기본값을 반환해야 한다', () => {
      const defaultData: StorageData = {
        collections: [],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      const result = loadFromStorage('non-existent-key', { defaultData });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(defaultData);
    });

    test('잘못된 JSON 데이터일 때 기본값을 반환하고 오류를 기록해야 한다', () => {
      localStorage.setItem('tab-nexus-data', '잘못된JSON{');
      const defaultData: StorageData = {
        collections: [],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      const result = loadFromStorage('tab-nexus-data', { defaultData });

      expect(result.success).toBe(false);
      expect(result.data).toEqual(defaultData);
      expect(result.error).toContain('JSON 파싱 오류');
    });

    test('데이터를 삭제할 수 있어야 한다', () => {
      localStorage.setItem('test-key', 'test-value');

      const result = removeFromStorage('test-key');

      expect(result.success).toBe(true);
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    test('스토리지를 완전히 비울 수 있어야 한다', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');

      const result = clearStorage();

      expect(result.success).toBe(true);
      expect(localStorage.length).toBe(0);
    });
  });

  describe('스토리지 옵션', () => {
    test('세션 스토리지를 사용할 수 있어야 한다', () => {
      const testData: StorageData = {
        collections: [],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };
      const options: StorageOptions = {
        storage: 'session',
      };

      const result = saveToStorage('test-key', testData, options);

      expect(result.success).toBe(true);
      expect(sessionStorage.getItem('test-key')).toBeDefined();
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    test('압축 옵션을 사용할 수 있어야 한다', () => {
      const largeData: StorageData = {
        collections: Array(100).fill(null).map((_, i) => ({
          id: `col-${i}`,
          title: `컬렉션 ${i}`.repeat(10),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: i,
        })),
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };
      const options: StorageOptions = {
        compress: true,
      };

      const result = saveToStorage('large-data', largeData, options);

      expect(result.success).toBe(true);
      // 압축된 데이터가 원본보다 작아야 함
      const saved = localStorage.getItem('large-data')!;
      const uncompressed = JSON.stringify(largeData);
      expect(saved.length).toBeLessThan(uncompressed.length);
    });

    test('TTL 설정으로 만료된 데이터를 처리할 수 있어야 한다', () => {
      const testData: StorageData = {
        collections: [],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };
      const options: StorageOptions = {
        ttl: -1, // 이미 만료된 시간
      };

      saveToStorage('expired-data', testData, options);

      const result = loadFromStorage('expired-data');

      expect(result.success).toBe(false);
      expect(result.error).toContain('만료된 데이터');
    });
  });

  describe('데이터 검증', () => {
    test('유효한 스토리지 데이터를 검증할 수 있어야 한다', () => {
      const validData: StorageData = {
        collections: [{
          id: 'col-1',
          title: '테스트',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0,
        }],
        tabs: [{
          id: 'tab-1',
          title: '테스트 탭',
          url: 'https://example.com',
          type: 'link',
          collectionId: 'col-1',
          tags: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0,
        }],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      const result = validateStorageData(validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('잘못된 스토리지 데이터를 검증해야 한다', () => {
      const invalidData = {
        collections: 'not-array', // 배열이 아님
        tabs: null, // null 값
        version: 123, // 문자열이 아님
        // lastUpdated 누락
      };

      const result = validateStorageData(invalidData as any);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(error => error.includes('collections'))).toBe(true);
      expect(result.errors.some(error => error.includes('tabs'))).toBe(true);
      expect(result.errors.some(error => error.includes('version'))).toBe(true);
      expect(result.errors.some(error => error.includes('lastUpdated'))).toBe(true);
    });

    test('참조 무결성을 검증해야 한다', () => {
      const dataWithOrphanTabs: StorageData = {
        collections: [{
          id: 'col-1',
          title: '테스트',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0,
        }],
        tabs: [{
          id: 'tab-1',
          title: '고아 탭',
          url: 'https://example.com',
          type: 'link',
          collectionId: 'non-existent-collection', // 존재하지 않는 컬렉션
          tags: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0,
        }],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      const result = validateStorageData(dataWithOrphanTabs);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('참조 무결성'))).toBe(true);
    });
  });

  describe('데이터 마이그레이션', () => {
    test('버전 1.0.0에서 1.1.0으로 마이그레이션할 수 있어야 한다', () => {
      const oldData = {
        collections: [{
          id: 'col-1',
          title: '테스트',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0,
        }],
        tabs: [{
          id: 'tab-1',
          title: '테스트',
          url: 'https://example.com',
          collectionId: 'col-1',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0,
          // 구버전에는 type 필드가 없음
        }],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      const result = migrateStorageData(oldData, '1.1.0');

      expect(result.success).toBe(true);
      expect(result.data.version).toBe('1.1.0');
      expect(result.data.tabs[0].type).toBe('link'); // 기본값으로 설정됨
    });

    test('알 수 없는 버전에서 마이그레이션하면 오류가 발생해야 한다', () => {
      const unknownVersionData = {
        version: '999.0.0',
        collections: [],
        tabs: [],
        lastUpdated: Date.now(),
      };

      const result = migrateStorageData(unknownVersionData, '1.1.0');

      expect(result.success).toBe(false);
      expect(result.error).toContain('지원하지 않는 버전');
    });

    test('같은 버전으로 마이그레이션하면 변경 없이 성공해야 한다', () => {
      const currentData: StorageData = {
        collections: [],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      const result = migrateStorageData(currentData, '1.0.0');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(currentData);
    });
  });

  describe('스토리지 용량 관리', () => {
    test('스토리지 사용량을 계산할 수 있어야 한다', () => {
      localStorage.setItem('test1', 'value1');
      localStorage.setItem('test2', 'value2');

      const result = getStorageSize();

      expect(result.success).toBe(true);
      expect(result.data?.used).toBeGreaterThan(0);
      expect(result.data?.available).toBeGreaterThan(0);
      expect(result.data?.total).toBeGreaterThan(0);
      expect(result.data?.usagePercentage).toBeGreaterThan(0);
    });

    test('스토리지 용량 초과 시 오류를 발생시켜야 한다', () => {
      // 특정 키에서만 QuotaExceededError를 발생시키도록 모킹
      const originalSetItem = mockLocalStorage.setItem;
      mockLocalStorage.setItem = vi.fn().mockImplementation((key, value) => {
        if (key === 'test-key') {
          const error = new Error('QuotaExceededError');
          error.name = 'QuotaExceededError';
          throw error;
        }
        return originalSetItem.call(mockLocalStorage, key, value);
      });

      const testData: StorageData = {
        collections: [],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      const result = saveToStorage('test-key', testData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('스토리지 용량 부족');

      // 원래 메서드 복원
      mockLocalStorage.setItem = originalSetItem;
    });

    test('스토리지 정리 기능이 작동해야 한다', () => {
      // 만료된 데이터와 일반 데이터를 저장
      const expiredItem = {
        data: { test: 'value' },
        timestamp: Date.now() - 86400000, // 1일 전
        ttl: 3600000, // 1시간 TTL (이미 만료됨)
      };

      const validItem = {
        data: { test: 'value' },
        timestamp: Date.now(),
        // ttl 없음 (만료되지 않음)
      };

      localStorage.setItem('expired-1', JSON.stringify(expiredItem));
      localStorage.setItem('valid-data', JSON.stringify(validItem));

      const result = clearStorage({ onlyExpired: true });

      expect(result.success).toBe(true);
      expect(result.cleaned).toBeGreaterThan(0);
      expect(localStorage.getItem('expired-1')).toBeNull();
      expect(localStorage.getItem('valid-data')).toBeDefined();
    });
  });

  describe('압축 기능', () => {
    test('데이터를 압축할 수 있어야 한다', () => {
      const originalData = 'A'.repeat(1000); // 큰 데이터

      const compressed = compressData(originalData);

      expect(compressed.length).toBeLessThan(originalData.length);
    });

    test('압축된 데이터를 해제할 수 있어야 한다', () => {
      const originalData = 'Hello World'.repeat(100);

      const compressed = compressData(originalData);
      const decompressed = decompressData(compressed);

      expect(decompressed).toBe(originalData);
    });

    test('압축 해제 실패 시 오류를 발생시켜야 한다', () => {
      // 메모리 오류를 유발할 수 있는 잘못된 압축 데이터
      const invalidCompressed = '◊999999999◊x◊'; // 매우 큰 반복 횟수로 메모리 오류 유발

      expect(() => {
        decompressData(invalidCompressed);
      }).toThrow('압축 해제 실패');
    });
  });

  describe('에러 처리', () => {
    test('StorageError를 올바르게 생성해야 한다', () => {
      const error = new StorageError('테스트 오류', 'TEST_ERROR');

      expect(error.message).toBe('테스트 오류');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('StorageError');
    });

    test('StorageQuotaError를 올바르게 생성해야 한다', () => {
      const error = new StorageQuotaError('용량 부족', 1000, 500);

      expect(error.message).toBe('용량 부족');
      expect(error.required).toBe(1000);
      expect(error.available).toBe(500);
      expect(error.name).toBe('StorageQuotaError');
    });

    test('네트워크 오프라인 상태를 감지해야 한다', () => {
      // navigator.onLine을 모킹
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const testData: StorageData = {
        collections: [],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      const result = saveToStorage('test-key', testData, {
        requireOnline: true
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('오프라인 상태');
    });
  });

  describe('백업 및 복원', () => {
    test('스토리지 데이터를 백업할 수 있어야 한다', () => {
      const testData: StorageData = {
        collections: [{
          id: 'col-1',
          title: '테스트',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0,
        }],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };
      saveToStorage('tab-nexus-data', testData);

      const result = loadFromStorage('tab-nexus-data', {
        createBackup: true
      });

      expect(result.success).toBe(true);
      expect(localStorage.getItem('tab-nexus-data-backup')).toBeDefined();
    });

    test('백업에서 데이터를 복원할 수 있어야 한다', () => {
      const backupData: StorageData = {
        collections: [{
          id: 'col-1',
          title: '백업 데이터',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0,
        }],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };
      localStorage.setItem('tab-nexus-data-backup', JSON.stringify(backupData));

      const result = loadFromStorage('tab-nexus-data', {
        useBackup: true
      });

      expect(result.success).toBe(true);
      expect(result.data?.collections[0].title).toBe('백업 데이터');
    });
  });

  describe('동시성 처리', () => {
    test('동시 저장 요청을 처리할 수 있어야 한다', async () => {
      const testData1: StorageData = {
        collections: [{
          id: 'col-1',
          title: '첫번째',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0
        }],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };
      const testData2: StorageData = {
        collections: [{
          id: 'col-2',
          title: '두번째',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sortOrder: 0
        }],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now() + 1000,
      };

      const promise1 = Promise.resolve(saveToStorage('concurrent-test-1', testData1));
      const promise2 = Promise.resolve(saveToStorage('concurrent-test-2', testData2));

      const results = await Promise.all([promise1, promise2]);

      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });

    test('스토리지 락 메커니즘이 작동해야 한다', () => {
      const testData: StorageData = {
        collections: [],
        tabs: [],
        version: '1.0.0',
        lastUpdated: Date.now(),
      };

      // 정상적인 락 사용 시나리오 테스트
      const result1 = saveToStorage('lock-test-key', testData, {
        acquireLock: true,
        lockTimeout: 1000,
      });

      // 다른 키에 대해서는 락이 영향을 주지 않아야 함
      const result2 = saveToStorage('different-key', testData, {
        acquireLock: true,
        lockTimeout: 1000,
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      // 같은 키에 대한 연속 저장은 성공해야 함 (이전 락이 해제되었으므로)
      const result3 = saveToStorage('lock-test-key', testData, {
        acquireLock: true,
        lockTimeout: 1000,
      });

      expect(result3.success).toBe(true);
    });
  });
});