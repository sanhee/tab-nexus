/**
 * 디바운스 및 쓰로틀 유틸리티
 * 함수 호출 빈도를 제어하여 성능을 최적화합니다
 *
 * 특징:
 * - 디바운스: 연속 호출을 지연시켜 마지막 호출만 실행
 * - 쓰로틀: 일정 간격으로만 함수 실행 허용
 * - Promise 기반 비동기 지원
 * - 고급 옵션 (immediate, maxWait)
 * - 메모리 누수 방지
 */

// WeakMap을 사용하여 메모리 누수 방지
const debounceMap = new WeakMap<Function, {
  timerId: NodeJS.Timeout | null;
  lastArgs: any[];
  lastThis: any;
  resolve?: (value: any) => void;
  reject?: (error: any) => void;
}>();

const throttleMap = new WeakMap<Function, {
  timerId: NodeJS.Timeout | null;
  lastExecTime: number;
  lastArgs: any[];
  lastThis: any;
}>();

// 디바운스 옵션 타입
export interface DebounceOptions {
  immediate?: boolean;    // 첫 호출을 즉시 실행
  maxWait?: number;      // 최대 대기 시간
}

// 에러 메시지 상수
const DEBOUNCE_ERRORS = {
  INVALID_FUNCTION: '함수가 필요합니다',
  INVALID_DELAY: '지연 시간은 0 이상이어야 합니다'
} as const;

/**
 * 함수의 실행을 지연시키는 디바운스를 적용합니다
 * 연속된 호출에서 마지막 호출만 지정된 시간 후에 실행됩니다
 *
 * @param func 디바운스를 적용할 함수
 * @param delay 지연 시간 (밀리초)
 * @returns 디바운스가 적용된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> {
  if (typeof func !== 'function') {
    throw new Error(DEBOUNCE_ERRORS.INVALID_FUNCTION);
  }

  // 음수 지연시간을 0으로 정규화
  const normalizedDelay = Math.max(0, delay);

  const debouncedFunction = function (this: any, ...args: any[]) {
    return new Promise((resolve, reject) => {
      const context = debounceMap.get(debouncedFunction) || {
        timerId: null,
        lastArgs: [],
        lastThis: null
      };

      // 기존 타이머 정리
      if (context.timerId) {
        clearTimeout(context.timerId);
      }

      // 현재 호출의 컨텍스트 저장
      context.lastArgs = args;
      context.lastThis = this;
      context.resolve = resolve;
      context.reject = reject;

      // 새 타이머 설정
      context.timerId = setTimeout(async () => {
        try {
          const result = await func.apply(context.lastThis, context.lastArgs);
          context.resolve?.(result);
        } catch (error) {
          context.reject?.(error);
        } finally {
          context.timerId = null;
        }
      }, normalizedDelay);

      debounceMap.set(debouncedFunction, context);
    });
  } as DebouncedFunction<T>;

  // 캔슬 메서드
  debouncedFunction.cancel = () => {
    const context = debounceMap.get(debouncedFunction);
    if (context?.timerId) {
      clearTimeout(context.timerId);
      context.timerId = null;
    }
  };

  // 즉시 실행 메서드
  debouncedFunction.flush = () => {
    const context = debounceMap.get(debouncedFunction);
    if (context?.timerId) {
      clearTimeout(context.timerId);
      context.timerId = null;

      try {
        const result = func.apply(context.lastThis, context.lastArgs);
        context.resolve?.(result);
      } catch (error) {
        context.reject?.(error);
      }
    }
  };

  return debouncedFunction;
}

/**
 * 일정 간격으로만 함수 실행을 허용하는 쓰로틀을 적용합니다
 * 첫 번째 호출은 즉시 실행되고, 이후 호출은 간격에 따라 실행됩니다
 *
 * @param func 쓰로틀을 적용할 함수
 * @param delay 실행 간격 (밀리초)
 * @returns 쓰로틀이 적용된 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  if (typeof func !== 'function') {
    throw new Error(DEBOUNCE_ERRORS.INVALID_FUNCTION);
  }

  const normalizedDelay = Math.max(0, delay);

  const throttledFunction = function (this: any, ...args: any[]) {
    const now = Date.now();
    const context = throttleMap.get(throttledFunction) || {
      timerId: null,
      lastExecTime: 0,
      lastArgs: [],
      lastThis: null
    };

    context.lastArgs = args;
    context.lastThis = this;

    // 첫 호출이거나 충분한 시간이 지난 경우 즉시 실행
    if (now - context.lastExecTime >= normalizedDelay) {
      context.lastExecTime = now;
      throttleMap.set(throttledFunction, context);
      return func.apply(this, args);
    }

    // 아직 실행 중인 타이머가 없다면 지연 실행 예약
    if (!context.timerId) {
      const remainingTime = normalizedDelay - (now - context.lastExecTime);

      context.timerId = setTimeout(() => {
        context.lastExecTime = Date.now();
        context.timerId = null;
        func.apply(context.lastThis, context.lastArgs);
        throttleMap.set(throttledFunction, context);
      }, remainingTime);
    }

    throttleMap.set(throttledFunction, context);
  } as T;

  return throttledFunction;
}

/**
 * 고급 옵션을 지원하는 디바운스 함수를 생성합니다
 *
 * @param func 디바운스를 적용할 함수
 * @param delay 지연 시간 (밀리초)
 * @param options 디바운스 옵션
 * @returns 고급 디바운스가 적용된 함수
 */
export function createDebouncedFunction<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: DebounceOptions = {}
): T {
  if (typeof func !== 'function') {
    throw new Error(DEBOUNCE_ERRORS.INVALID_FUNCTION);
  }

  const { immediate = false, maxWait } = options;
  const normalizedDelay = Math.max(0, delay);

  let timerId: NodeJS.Timeout | null = null;
  let maxTimerId: NodeJS.Timeout | null = null;
  let lastCallTime = 0;
  let lastArgs: any[] = [];
  let lastThis: any = null;
  let hasBeenCalled = false;

  const debouncedFunction = function (this: any, ...args: any[]) {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;

    // immediate 옵션: 첫 호출을 즉시 실행
    if (immediate && !hasBeenCalled) {
      hasBeenCalled = true;
      return func.apply(this, args);
    }

    // 기존 타이머들 정리
    if (timerId) {
      clearTimeout(timerId);
    }

    // maxWait 옵션: 최대 대기 시간 설정
    if (maxWait && !maxTimerId) {
      maxTimerId = setTimeout(() => {
        maxTimerId = null;
        hasBeenCalled = false;
        func.apply(lastThis, lastArgs);
      }, maxWait);
    }

    // 일반 디바운스 타이머 (immediate 모드에서는 추가 실행하지 않음)
    timerId = setTimeout(() => {
      timerId = null;
      hasBeenCalled = false;

      if (maxTimerId) {
        clearTimeout(maxTimerId);
        maxTimerId = null;
      }

      // immediate가 true이고 이미 실행된 경우 추가 실행하지 않음
      if (!immediate) {
        func.apply(lastThis, lastArgs);
      }
    }, normalizedDelay);

    lastCallTime = now;
  } as T;

  return debouncedFunction;
}

// 디바운스된 함수 타입 정의 (타입 안전성 향상)
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel(): void;
  flush(): void;
}

/**
 * 디바운스된 함수의 대기 중인 실행을 취소합니다
 * 타입 안전성을 위해 DebouncedFunction 타입 사용
 *
 * @param debouncedFunc 디바운스된 함수
 */
export function cancelDebounce<T extends (...args: any[]) => any>(
  debouncedFunc: DebouncedFunction<T>
): void {
  debouncedFunc.cancel();
}

/**
 * 디바운스된 함수를 즉시 실행합니다
 * 타입 안전성을 위해 DebouncedFunction 타입 사용
 *
 * @param debouncedFunc 디바운스된 함수
 */
export function flushDebounce<T extends (...args: any[]) => any>(
  debouncedFunc: DebouncedFunction<T>
): void {
  debouncedFunc.flush();
}