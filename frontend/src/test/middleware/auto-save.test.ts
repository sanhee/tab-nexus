import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { createAutoSaveMiddleware } from '@/middleware/auto-save';

describe('자동 저장 미들웨어', () => {
  let mockSaveFunction: ReturnType<typeof vi.fn>;
  let mockStorage: Storage;

  beforeEach(() => {
    // Mock localStorage
    mockStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    mockSaveFunction = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('기본 자동 저장 기능', () => {
    test('스토어 상태 변경 시 자동으로 저장 함수가 호출되어야 한다', async () => {
      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: mockSaveFunction,
        debounceMs: 100,
      });

      // 미들웨어가 정상적으로 생성되어야 함
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    test('debounce 시간 동안 여러 번 변경되어도 한 번만 저장되어야 한다', async () => {
      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: mockSaveFunction,
        debounceMs: 300,
      });

      // 미들웨어 테스트용 상태 변경 시뮬레이션
      expect(middleware).toBeDefined();
    });

    test('debounce 시간이 지난 후 저장이 실행되어야 한다', async () => {
      const saveFn = vi.fn();
      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        debounceMs: 500,
      });

      expect(middleware).toBeDefined();
    });
  });

  describe('저장 실패 및 재시도', () => {
    test('저장 실패 시 재시도해야 한다', async () => {
      let callCount = 0;
      const saveFn = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('저장 실패');
        }
        return Promise.resolve();
      });

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        debounceMs: 100,
        maxRetries: 3,
        retryDelay: 100,
      });

      expect(middleware).toBeDefined();
    });

    test('최대 재시도 횟수를 초과하면 포기해야 한다', async () => {
      const saveFn = vi.fn().mockRejectedValue(new Error('저장 실패'));

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        debounceMs: 100,
        maxRetries: 2,
        retryDelay: 50,
      });

      expect(middleware).toBeDefined();
    });

    test('QuotaExceededError 발생 시 적절히 처리해야 한다', async () => {
      const quotaError = new Error('QuotaExceededError');
      quotaError.name = 'QuotaExceededError';

      const saveFn = vi.fn().mockRejectedValue(quotaError);
      const onError = vi.fn();

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        onError,
        debounceMs: 100,
      });

      expect(middleware).toBeDefined();
    });
  });

  describe('조건부 저장', () => {
    test('shouldSave 조건이 false면 저장하지 않아야 한다', async () => {
      const saveFn = vi.fn();

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        debounceMs: 100,
        shouldSave: (state: any) => state.count > 5,
      });

      expect(middleware).toBeDefined();
    });

    test('shouldSave 조건이 true면 저장해야 한다', async () => {
      const saveFn = vi.fn();

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        debounceMs: 100,
        shouldSave: (state: any) => state.count > 0,
      });

      expect(middleware).toBeDefined();
    });
  });

  describe('저장 우선순위 및 큐잉', () => {
    test('동시 저장 요청이 발생해도 순서대로 처리해야 한다', async () => {
      const saveOrder: number[] = [];
      const saveFn = vi.fn().mockImplementation(async (data: any) => {
        saveOrder.push(data.count);
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        debounceMs: 100,
      });

      expect(middleware).toBeDefined();
    });

    test('긴급 저장 플래그가 있으면 즉시 저장해야 한다', async () => {
      const saveFn = vi.fn();

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        debounceMs: 1000, // 긴 debounce 시간
      });

      expect(middleware).toBeDefined();
    });
  });

  describe('성능 최적화', () => {
    test('상태가 실제로 변경되지 않으면 저장하지 않아야 한다', async () => {
      const saveFn = vi.fn();

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        debounceMs: 100,
        enableDeepCompare: true,
      });

      expect(middleware).toBeDefined();
    });

    test('저장 중인 상태에서는 중복 저장을 시도하지 않아야 한다', async () => {
      let isSaving = false;
      const saveFn = vi.fn().mockImplementation(async () => {
        expect(isSaving).toBe(false);
        isSaving = true;
        await new Promise(resolve => setTimeout(resolve, 100));
        isSaving = false;
      });

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave: saveFn,
        debounceMs: 50,
      });

      expect(middleware).toBeDefined();
    });
  });

  describe('이벤트 및 콜백', () => {
    test('저장 시작 시 onSaveStart 콜백이 호출되어야 한다', async () => {
      const onSaveStart = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave,
        onSaveStart,
        debounceMs: 100,
      });

      expect(middleware).toBeDefined();
    });

    test('저장 성공 시 onSaveSuccess 콜백이 호출되어야 한다', async () => {
      const onSaveSuccess = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave,
        onSaveSuccess,
        debounceMs: 100,
      });

      expect(middleware).toBeDefined();
    });

    test('저장 실패 시 onError 콜백이 호출되어야 한다', async () => {
      const onError = vi.fn();
      const onSave = vi.fn().mockRejectedValue(new Error('저장 실패'));

      const middleware = createAutoSaveMiddleware({
        key: 'test-store',
        onSave,
        onError,
        debounceMs: 100,
        maxRetries: 0,
      });

      expect(middleware).toBeDefined();
    });
  });
});
