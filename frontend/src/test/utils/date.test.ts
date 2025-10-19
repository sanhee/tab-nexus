import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  parseDate,
  isValidDate,
  getDateDifference,
  formatDateRange,
  getTimestamp,
  isToday,
  isThisWeek,
  isThisMonth
} from '../../utils/date.js';

describe('날짜 포맷 유틸리티', () => {
  beforeEach(() => {
    // 시간 기반 테스트를 위한 고정 시간 설정
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-10-20T15:30:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('YYYY-MM-DD 형식으로 날짜를 포맷할 수 있어야 한다', () => {
    const date = new Date('2024-10-20T15:30:00.000Z');
    const formatted = formatDate(date);

    expect(formatted).toBe('2024-10-20');
  });

  test('커스텀 구분자로 날짜를 포맷할 수 있어야 한다', () => {
    const date = new Date('2024-10-20T15:30:00.000Z');
    const formatted = formatDate(date, '/');

    expect(formatted).toBe('2024/10/20');
  });

  test('한국어 로케일로 날짜를 포맷할 수 있어야 한다', () => {
    const date = new Date('2024-10-20T15:30:00.000Z');
    const formatted = formatDate(date, '-', 'ko-KR');

    expect(formatted).toBe('2024-10-20');
  });

  test('잘못된 날짜 객체에 대해 오류를 반환해야 한다', () => {
    const invalidDate = new Date('invalid');

    expect(() => formatDate(invalidDate)).toThrow('유효하지 않은 날짜입니다');
  });
});

describe('날짜 시간 포맷 유틸리티', () => {
  test('YYYY-MM-DD HH:mm:ss 형식으로 날짜 시간을 포맷할 수 있어야 한다', () => {
    const date = new Date('2024-10-20T15:30:45.000Z');
    const formatted = formatDateTime(date);

    expect(formatted).toBe('2024-10-20 15:30:45');
  });

  test('12시간 형식으로 날짜 시간을 포맷할 수 있어야 한다', () => {
    const date = new Date('2024-10-20T15:30:45.000Z');
    const formatted = formatDateTime(date, true);

    expect(formatted).toBe('2024-10-20 3:30:45 PM');
  });

  test('커스텀 형식으로 날짜 시간을 포맷할 수 있어야 한다', () => {
    const date = new Date('2024-10-20T15:30:45.000Z');
    const formatted = formatDateTime(date, false, 'MM/DD/YYYY HH:mm');

    expect(formatted).toBe('10/20/2024 15:30');
  });
});

describe('상대적 시간 포맷 유틸리티', () => {
  test('방금 전 시간을 포맷할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const date = new Date('2024-10-20T15:29:30.000Z'); // 30초 전
    const formatted = formatRelativeTime(date, baseDate);

    expect(formatted).toBe('방금 전');
  });

  test('몇 분 전 시간을 포맷할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const date = new Date('2024-10-20T15:25:00.000Z'); // 5분 전
    const formatted = formatRelativeTime(date, baseDate);

    expect(formatted).toBe('5분 전');
  });

  test('몇 시간 전 시간을 포맷할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const date = new Date('2024-10-20T13:30:00.000Z'); // 2시간 전
    const formatted = formatRelativeTime(date, baseDate);

    expect(formatted).toBe('2시간 전');
  });

  test('며칠 전 시간을 포맷할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const date = new Date('2024-10-18T15:30:00.000Z'); // 2일 전
    const formatted = formatRelativeTime(date, baseDate);

    expect(formatted).toBe('2일 전');
  });

  test('몇 주 전 시간을 포맷할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const date = new Date('2024-10-06T15:30:00.000Z'); // 2주 전
    const formatted = formatRelativeTime(date, baseDate);

    expect(formatted).toBe('2주 전');
  });

  test('몇 달 전 시간을 포맷할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const date = new Date('2024-08-20T15:30:00.000Z'); // 2달 전
    const formatted = formatRelativeTime(date, baseDate);

    expect(formatted).toBe('2달 전');
  });

  test('1년 이상 된 시간은 절대 날짜로 포맷해야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const date = new Date('2023-10-20T15:30:00.000Z'); // 1년 전
    const formatted = formatRelativeTime(date, baseDate);

    expect(formatted).toBe('2023-10-20');
  });

  test('미래 시간에 대해서도 상대적 시간을 표시할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const date = new Date('2024-10-20T17:30:00.000Z'); // 2시간 후
    const formatted = formatRelativeTime(date, baseDate);

    expect(formatted).toBe('2시간 후');
  });
});

describe('날짜 파싱 유틸리티', () => {
  test('ISO 8601 문자열을 파싱할 수 있어야 한다', () => {
    const dateStr = '2024-10-20T15:30:00.000Z';
    const parsed = parseDate(dateStr);

    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.getUTCFullYear()).toBe(2024);
    expect(parsed.getUTCMonth()).toBe(9); // 0-based
    expect(parsed.getUTCDate()).toBe(20);
  });

  test('YYYY-MM-DD 형식을 파싱할 수 있어야 한다', () => {
    const dateStr = '2024-10-20';
    const parsed = parseDate(dateStr);

    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.getFullYear()).toBe(2024);
    expect(parsed.getMonth()).toBe(9);
    expect(parsed.getDate()).toBe(20);
  });

  test('다양한 구분자 형식을 파싱할 수 있어야 한다', () => {
    const dateStr1 = '2024/10/20';
    const dateStr2 = '2024.10.20';

    const parsed1 = parseDate(dateStr1);
    const parsed2 = parseDate(dateStr2);

    expect(parsed1.getFullYear()).toBe(2024);
    expect(parsed2.getFullYear()).toBe(2024);
  });

  test('잘못된 날짜 문자열에 대해 오류를 발생시켜야 한다', () => {
    const invalidDateStr = 'invalid-date';

    expect(() => parseDate(invalidDateStr)).toThrow('유효하지 않은 날짜 형식입니다');
  });
});

describe('날짜 검증 유틸리티', () => {
  test('유효한 날짜 객체를 검증할 수 있어야 한다', () => {
    const validDate = new Date('2024-10-20');

    expect(isValidDate(validDate)).toBe(true);
  });

  test('유효하지 않은 날짜 객체를 검증할 수 있어야 한다', () => {
    const invalidDate = new Date('invalid');

    expect(isValidDate(invalidDate)).toBe(false);
  });

  test('null이나 undefined에 대해 false를 반환해야 한다', () => {
    expect(isValidDate(null as any)).toBe(false);
    expect(isValidDate(undefined as any)).toBe(false);
  });

  test('Date 객체가 아닌 값에 대해 false를 반환해야 한다', () => {
    expect(isValidDate('2024-10-20' as any)).toBe(false);
    expect(isValidDate(20241020 as any)).toBe(false);
  });
});

describe('날짜 차이 계산 유틸리티', () => {
  test('두 날짜 간의 일 수 차이를 계산할 수 있어야 한다', () => {
    const date1 = new Date('2024-10-20');
    const date2 = new Date('2024-10-22');

    const difference = getDateDifference(date1, date2, 'days');

    expect(difference).toBe(2);
  });

  test('두 날짜 간의 시간 차이를 계산할 수 있어야 한다', () => {
    const date1 = new Date('2024-10-20T15:30:00');
    const date2 = new Date('2024-10-20T17:30:00');

    const difference = getDateDifference(date1, date2, 'hours');

    expect(difference).toBe(2);
  });

  test('두 날짜 간의 분 차이를 계산할 수 있어야 한다', () => {
    const date1 = new Date('2024-10-20T15:30:00');
    const date2 = new Date('2024-10-20T15:45:00');

    const difference = getDateDifference(date1, date2, 'minutes');

    expect(difference).toBe(15);
  });

  test('음수 차이도 계산할 수 있어야 한다', () => {
    const date1 = new Date('2024-10-22');
    const date2 = new Date('2024-10-20');

    const difference = getDateDifference(date1, date2, 'days');

    expect(difference).toBe(-2);
  });
});

describe('날짜 범위 포맷 유틸리티', () => {
  test('같은 날의 날짜 범위를 포맷할 수 있어야 한다', () => {
    const startDate = new Date('2024-10-20T09:00:00');
    const endDate = new Date('2024-10-20T17:00:00');

    const formatted = formatDateRange(startDate, endDate);

    expect(formatted).toBe('2024-10-20 09:00 - 17:00');
  });

  test('다른 날의 날짜 범위를 포맷할 수 있어야 한다', () => {
    const startDate = new Date('2024-10-20T09:00:00');
    const endDate = new Date('2024-10-22T17:00:00');

    const formatted = formatDateRange(startDate, endDate);

    expect(formatted).toBe('2024-10-20 09:00 - 2024-10-22 17:00');
  });
});

describe('타임스탬프 유틸리티', () => {
  test('현재 시간의 타임스탬프를 반환할 수 있어야 한다', () => {
    const timestamp = getTimestamp();

    expect(typeof timestamp).toBe('number');
    // 고정된 시간으로 설정된 시스템 시간이어야 함
    expect(timestamp).toBeGreaterThan(0);
  });

  test('특정 날짜의 타임스탬프를 반환할 수 있어야 한다', () => {
    const date = new Date('2024-10-20T15:30:00.000Z');
    const timestamp = getTimestamp(date);

    expect(timestamp).toBe(date.getTime());
  });
});

describe('날짜 상태 확인 유틸리티', () => {
  test('오늘 날짜인지 확인할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const today = new Date('2024-10-20T10:00:00.000Z');
    const yesterday = new Date('2024-10-19T10:00:00.000Z');

    expect(isToday(today, baseDate)).toBe(true);
    expect(isToday(yesterday, baseDate)).toBe(false);
  });

  test('이번 주 날짜인지 확인할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z'); // 일요일
    const thisWeek = new Date('2024-10-21T10:00:00.000Z'); // 월요일 (같은 주)
    const lastWeek = new Date('2024-10-12T10:00:00.000Z'); // 전주 토요일

    expect(isThisWeek(thisWeek, baseDate)).toBe(true);
    expect(isThisWeek(lastWeek, baseDate)).toBe(false);
  });

  test('이번 달 날짜인지 확인할 수 있어야 한다', () => {
    const baseDate = new Date('2024-10-20T15:30:00.000Z');
    const thisMonth = new Date('2024-10-15T10:00:00.000Z');
    const lastMonth = new Date('2024-09-15T10:00:00.000Z');

    expect(isThisMonth(thisMonth, baseDate)).toBe(true);
    expect(isThisMonth(lastMonth, baseDate)).toBe(false);
  });
});

describe('날짜 포맷 성능 테스트', () => {
  test('1000번의 날짜 포맷이 100ms 이내에 완료되어야 한다', () => {
    const startTime = Date.now();
    const date = new Date('2024-10-20T15:30:00.000Z');

    for (let i = 0; i < 1000; i++) {
      formatDate(date);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });

  test('상대적 시간 포맷 성능이 적절해야 한다', () => {
    const startTime = Date.now();
    const date = new Date('2024-10-20T14:30:00.000Z');

    for (let i = 0; i < 100; i++) {
      formatRelativeTime(date);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(50);
  });
});

describe('날짜 유틸리티 엣지 케이스', () => {
  test('윤년을 올바르게 처리해야 한다', () => {
    const leapYear = new Date('2024-02-29');
    const formatted = formatDate(leapYear);

    expect(formatted).toBe('2024-02-29');
    expect(isValidDate(leapYear)).toBe(true);
  });

  test('시간대 변경을 고려해야 한다', () => {
    const utcDate = new Date('2024-10-20T00:00:00.000Z');
    const localFormatted = formatDate(utcDate);

    // UTC 기준으로 포맷되어야 함
    expect(localFormatted).toBe('2024-10-20');
  });

  test('매우 오래된 날짜도 처리할 수 있어야 한다', () => {
    const oldDate = new Date('1900-01-01');
    const formatted = formatDate(oldDate);

    expect(formatted).toBe('1900-01-01');
  });

  test('매우 미래의 날짜도 처리할 수 있어야 한다', () => {
    const futureDate = new Date('2100-12-31');
    const formatted = formatDate(futureDate);

    expect(formatted).toBe('2100-12-31');
  });
});