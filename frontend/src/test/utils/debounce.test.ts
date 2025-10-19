import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  debounce,
  throttle,
  createDebouncedFunction,
  cancelDebounce,
  flushDebounce
} from '../../utils/debounce.js';

describe('디바운스 유틸리티', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test('함수 실행을 지정된 시간만큼 지연해야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('연속 호출 시 마지막 호출만 실행되어야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('지연 시간 내에 재호출하면 타이머가 재설정되어야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    vi.advanceTimersByTime(50);

    debouncedFn(); // 타이머 재설정
    vi.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('인자가 마지막 호출의 값으로 전달되어야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  test('this 컨텍스트가 올바르게 유지되어야 한다', () => {
    const obj = {
      value: 'test',
      method: vi.fn(function(this: { value: string }) {
        return this.value;
      })
    };

    const debouncedMethod = debounce(obj.method, 100);
    debouncedMethod.call(obj);

    vi.advanceTimersByTime(100);
    expect(obj.method).toHaveBeenCalled();
  });

  test('반환값을 Promise로 받을 수 있어야 한다', async () => {
    const mockFn = vi.fn().mockReturnValue('result');
    const debouncedFn = debounce(mockFn, 100);

    const promise = debouncedFn();
    vi.advanceTimersByTime(100);

    await expect(promise).resolves.toBe('result');
  });
});

describe('쓰로틀 유틸리티', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test('지정된 간격으로만 함수가 실행되어야 한다', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn();
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('첫 번째 호출은 즉시 실행되어야 한다', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('마지막 호출도 지연 후 실행되어야 한다', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('first');
    throttledFn('second');
    throttledFn('third');

    expect(mockFn).toHaveBeenCalledWith('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('third');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('고급 디바운스 기능', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test('immediate 옵션으로 첫 호출을 즉시 실행할 수 있어야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = createDebouncedFunction(mockFn, 100, { immediate: true });

    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    debouncedFn();
    debouncedFn();
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1); // 추가 호출 없음
  });

  test('maxWait 옵션으로 최대 대기 시간을 제한할 수 있어야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = createDebouncedFunction(mockFn, 100, { maxWait: 200 });

    debouncedFn();
    vi.advanceTimersByTime(150);
    debouncedFn(); // 타이머 재설정되지만 maxWait 때문에 곧 실행

    vi.advanceTimersByTime(50); // 총 200ms 경과
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('디바운스를 수동으로 캔슬할 수 있어야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    cancelDebounce(debouncedFn);

    vi.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();
  });

  test('디바운스를 수동으로 즉시 실행할 수 있어야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('test');
    flushDebounce(debouncedFn);

    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1); // 추가 호출 없음
  });
});

describe('디바운스 성능 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test('많은 수의 호출이 효율적으로 처리되어야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    // 1000번 호출
    for (let i = 0; i < 1000; i++) {
      debouncedFn(i);
    }

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(999); // 마지막 값
  });

  test('메모리 누수가 없어야 한다', () => {
    const mockFn = vi.fn();
    let debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn = null as any; // 참조 해제

    vi.advanceTimersByTime(100);
    // 가비지 컬렉션 후에도 타이머가 정리되어야 함
  });
});

describe('디바운스 엣지 케이스', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test('0ms 지연시간도 올바르게 동작해야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('음수 지연시간을 0으로 처리해야 한다', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, -100);

    debouncedFn();
    vi.advanceTimersByTime(0);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('null이나 undefined 함수에 대해 오류를 발생시켜야 한다', () => {
    expect(() => debounce(null as any, 100)).toThrow('함수가 필요합니다');
    expect(() => debounce(undefined as any, 100)).toThrow('함수가 필요합니다');
  });

  test('비동기 함수도 올바르게 처리해야 한다', async () => {
    const asyncFn = vi.fn().mockResolvedValue('async result');
    const debouncedFn = debounce(asyncFn, 100);

    const promise = debouncedFn();
    vi.advanceTimersByTime(100);

    await expect(promise).resolves.toBe('async result');
  });

  test('에러를 던지는 함수도 올바르게 처리해야 한다', async () => {
    const errorFn = vi.fn().mockRejectedValue(new Error('Test error'));
    const debouncedFn = debounce(errorFn, 100);

    const promise = debouncedFn();
    vi.advanceTimersByTime(100);

    await expect(promise).rejects.toThrow('Test error');
  });
});

describe('실제 사용 케이스', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test('검색 입력 디바운싱 시뮬레이션', () => {
    const searchFn = vi.fn();
    const debouncedSearch = debounce(searchFn, 300);

    // 사용자가 빠르게 타이핑
    debouncedSearch('a');
    vi.advanceTimersByTime(100);
    debouncedSearch('ap');
    vi.advanceTimersByTime(100);
    debouncedSearch('app');
    vi.advanceTimersByTime(100);
    debouncedSearch('appl');
    vi.advanceTimersByTime(100);
    debouncedSearch('apple');

    // 아직 실행되지 않음
    expect(searchFn).not.toHaveBeenCalled();

    // 300ms 후 마지막 검색만 실행
    vi.advanceTimersByTime(300);
    expect(searchFn).toHaveBeenCalledWith('apple');
    expect(searchFn).toHaveBeenCalledTimes(1);
  });

  test('윈도우 리사이즈 이벤트 쓰로틀링 시뮬레이션', () => {
    const resizeFn = vi.fn();
    const throttledResize = throttle(resizeFn, 100);

    // 연속적인 리사이즈 이벤트
    throttledResize({ width: 100, height: 200 });
    throttledResize({ width: 110, height: 220 });
    throttledResize({ width: 120, height: 240 });

    expect(resizeFn).toHaveBeenCalledTimes(1);
    expect(resizeFn).toHaveBeenCalledWith({ width: 100, height: 200 });

    vi.advanceTimersByTime(100);
    expect(resizeFn).toHaveBeenCalledTimes(2);
    expect(resizeFn).toHaveBeenLastCalledWith({ width: 120, height: 240 });
  });
});