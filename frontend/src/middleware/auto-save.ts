/**
 * @fileoverview Zustand 자동 저장 미들웨어
 *
 * 스토어 상태 변경을 감지하여 자동으로 스토리지에 저장하는 미들웨어입니다.
 * Debounce, 재시도, 조건부 저장 등의 고급 기능을 제공합니다.
 *
 * @module middleware/auto-save
 * @since 1.0.0
 */

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';
import type { AutoSaveOptions, AutoSaveState } from '../types/middleware';

/**
 * 자동 저장 미들웨어 생성
 *
 * @template T - 스토어 상태 타입
 * @param {AutoSaveOptions<T>} options - 자동 저장 옵션
 * @returns Zustand 미들웨어 함수
 *
 * @example
 * ```typescript
 * const autoSave = createAutoSaveMiddleware({
 *   key: 'my-store',
 *   onSave: (state) => saveToStorage('my-store', state),
 *   debounceMs: 500,
 *   maxRetries: 3
 * });
 *
 * const useStore = create(
 *   autoSave((set) => ({
 *     data: '',
 *     updateData: (newData) => set({ data: newData })
 *   }))
 * );
 * ```
 */
export function createAutoSaveMiddleware<T>(
  options: AutoSaveOptions<T>
): <
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs> {
  const {
    onSave,
    debounceMs = 500,
    maxRetries = 3,
    retryDelay = 1000,
    shouldSave = () => true,
    enableDeepCompare = false,
    onSaveStart,
    onSaveSuccess,
    onError,
  } = options;

  // 내부 상태
  let saveTimeout: NodeJS.Timeout | null = null;
  let previousState: T | null = null;
  let saveState: AutoSaveState = {
    isSaving: false,
    lastSaveTime: null,
    lastError: null,
    retryCount: 0,
  };

  /**
   * Deep comparison을 통한 상태 변경 감지
   *
   * @param {T} newState - 새로운 상태
   * @returns {boolean} 상태가 변경되었는지 여부
   */
  function hasStateChanged(newState: T): boolean {
    if (!enableDeepCompare || previousState === null) {
      return true;
    }

    try {
      return JSON.stringify(newState) !== JSON.stringify(previousState);
    } catch {
      // JSON 직렬화 실패 시 변경된 것으로 간주 (circular reference 등)
      return true;
    }
  }

  /**
   * 저장 함수 (재시도 로직 포함)
   */
  async function performSave(state: T, retries = 0): Promise<void> {
    // 저장 조건 확인
    if (!shouldSave(state)) {
      return;
    }

    // 상태 변경 확인
    if (!hasStateChanged(state)) {
      return;
    }

    // 저장 중 플래그 설정
    if (saveState.isSaving) {
      return; // 이미 저장 중이면 중복 저장 방지
    }

    saveState.isSaving = true;
    saveState.retryCount = retries;

    try {
      // 저장 시작 콜백
      onSaveStart?.(state);

      // 실제 저장 수행
      await Promise.resolve(onSave(state));

      // 성공 처리
      saveState.lastSaveTime = Date.now();
      saveState.lastError = null;
      saveState.retryCount = 0;
      previousState = state;

      // 저장 성공 콜백
      onSaveSuccess?.(state);
    } catch (error: any) {
      saveState.lastError = error;

      // 재시도 로직
      if (retries < maxRetries) {
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, delay));

        // 재시도
        return performSave(state, retries + 1);
      } else {
        // 최대 재시도 초과 시 에러 콜백 호출
        onError?.(error, state);
      }
    } finally {
      saveState.isSaving = false;
    }
  }

  /**
   * Debounced 저장 트리거
   */
  function triggerSave(state: T): void {
    // 기존 타이머 취소
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // 새 타이머 설정
    saveTimeout = setTimeout(() => {
      performSave(state);
      saveTimeout = null;
    }, debounceMs);
  }

  /**
   * 미들웨어 함수
   */
  return (config) => (set, get, api) => {
    // 원본 setState 래핑
    const wrappedSet = ((...args: Parameters<typeof set>) => {
      // 상태 업데이트
      (set as any)(...args);

      // 자동 저장 트리거
      const newState = get();
      triggerSave(newState);
    }) as typeof set;

    return config(wrappedSet, get, api);
  };
}

/**
 * 즉시 저장 헬퍼 함수
 *
 * 디바운스를 무시하고 즉시 저장합니다.
 *
 * @param {T} state - 저장할 상태
 * @param {AutoSaveOptions<T>} options - 저장 옵션
 */
export async function saveImmediately<T>(
  state: T,
  options: AutoSaveOptions<T>
): Promise<void> {
  try {
    await Promise.resolve(options.onSave(state));
  } catch (error: any) {
    options.onError?.(error, state);
    throw error;
  }
}
