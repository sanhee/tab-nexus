/**
 * 날짜 포맷 유틸리티
 * 다양한 날짜 및 시간 포맷 기능을 제공합니다
 *
 * 특징:
 * - UTC 기반 처리로 시간대 안전성 보장
 * - 성능 최적화된 상수 및 캐싱
 * - 한국어 상대시간 지원
 * - 엄격한 타입 안전성
 */

// 시간 단위 상수 (성능 최적화를 위한 미리 계산된 값들)
const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000, // 근사값
  YEAR: 365 * 24 * 60 * 60 * 1000  // 근사값
} as const;

// 에러 메시지 상수화 (일관성 및 국제화 준비)
const ERROR_MESSAGES = {
  INVALID_DATE: '유효하지 않은 날짜입니다',
  INVALID_DATE_FORMAT: '유효하지 않은 날짜 형식입니다',
  UNSUPPORTED_UNIT: '지원하지 않는 단위입니다'
} as const;

// 상대시간 표현 상수 (성능 및 유지보수성 향상)
const RELATIVE_TIME_LABELS = {
  FUTURE_SOON: '곧',
  PAST_JUST_NOW: '방금 전',
  FUTURE_SUFFIX: '후',
  PAST_SUFFIX: '전',
  UNITS: {
    MINUTE: '분',
    HOUR: '시간',
    DAY: '일',
    WEEK: '주',
    MONTH: '달'
  }
} as const;

// 타입 정의 (더 엄격한 타입 시스템)
export type DateSeparator = '-' | '/' | '.';
export type DateDifferenceUnit = keyof typeof TIME_UNITS | 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
export type SupportedLocale = 'en-US' | 'ko-KR';

// 유틸리티 함수들 (내부 로직 최적화)
const padZero = (num: number): string => String(num).padStart(2, '0');
const getTimeUnitMs = (unit: DateDifferenceUnit): number => {
  switch (unit) {
    case 'milliseconds': return 1;
    case 'seconds': return TIME_UNITS.SECOND;
    case 'minutes': return TIME_UNITS.MINUTE;
    case 'hours': return TIME_UNITS.HOUR;
    case 'days': return TIME_UNITS.DAY;
    case 'weeks': return TIME_UNITS.WEEK;
    case 'months': return TIME_UNITS.MONTH;
    case 'years': return TIME_UNITS.YEAR;
    default: throw new Error(ERROR_MESSAGES.UNSUPPORTED_UNIT);
  }
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷합니다
 * UTC 기준으로 처리하여 시간대 문제를 방지합니다
 *
 * @param date 포맷할 날짜 객체
 * @param separator 날짜 구분자 (기본값: '-')
 * @param _locale 로케일 (향후 확장용, 현재 미사용)
 * @returns YYYY-MM-DD 형식의 문자열
 */
export function formatDate(date: Date, separator: DateSeparator = '-', _locale: SupportedLocale = 'en-US'): string {
  if (!isValidDate(date)) {
    throw new Error(ERROR_MESSAGES.INVALID_DATE);
  }

  const year = date.getUTCFullYear();
  const month = padZero(date.getUTCMonth() + 1);
  const day = padZero(date.getUTCDate());

  return `${year}${separator}${month}${separator}${day}`;
}

/**
 * 날짜와 시간을 포맷합니다
 * 24시간 형식 또는 12시간 형식을 지원하며, 커스텀 포맷도 가능합니다
 *
 * @param date 포맷할 날짜 객체
 * @param use12Hour 12시간 형식 사용 여부 (기본값: false)
 * @param customFormat 커스텀 포맷 문자열 (선택적)
 * @returns 포맷된 날짜시간 문자열
 */
export function formatDateTime(date: Date, use12Hour = false, customFormat?: string): string {
  if (!isValidDate(date)) {
    throw new Error(ERROR_MESSAGES.INVALID_DATE);
  }

  if (customFormat) {
    return formatCustomDateTime(date, customFormat);
  }

  const dateStr = formatDate(date);
  const hours = date.getUTCHours();
  const minutes = padZero(date.getUTCMinutes());
  const seconds = padZero(date.getUTCSeconds());

  if (use12Hour) {
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${dateStr} ${hour12}:${minutes}:${seconds} ${ampm}`;
  }

  const hour24 = padZero(hours);
  return `${dateStr} ${hour24}:${minutes}:${seconds}`;
}

/**
 * 커스텀 형식으로 날짜 시간을 포맷합니다
 * 지원 패턴: YYYY(년), MM(월), DD(일), HH(시), mm(분), ss(초)
 *
 * @param date 포맷할 날짜 객체
 * @param format 포맷 패턴 문자열
 * @returns 포맷된 문자열
 */
function formatCustomDateTime(date: Date, format: string): string {
  // 성능 최적화: 한 번에 모든 값을 추출
  const year = date.getUTCFullYear();
  const month = padZero(date.getUTCMonth() + 1);
  const day = padZero(date.getUTCDate());
  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());
  const seconds = padZero(date.getUTCSeconds());

  // 체이닝 방식으로 모든 치환을 한 번에 수행
  return format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
}

/**
 * 상대적 시간을 포맷합니다 (예: "2분 전", "3시간 후")
 * 한국어 표현을 사용하며, 1년 이상 차이나는 경우 절대 날짜를 표시합니다
 *
 * @param date 비교할 날짜 객체
 * @param baseDate 기준 날짜 (기본값: 현재 시간)
 * @returns 상대시간 문자열 또는 절대 날짜
 */
export function formatRelativeTime(date: Date, baseDate: Date = new Date()): string {
  if (!isValidDate(date)) {
    throw new Error(ERROR_MESSAGES.INVALID_DATE);
  }

  const diff = baseDate.getTime() - date.getTime();
  const absDiff = Math.abs(diff);
  const isFuture = diff < 0;
  const suffix = isFuture ? RELATIVE_TIME_LABELS.FUTURE_SUFFIX : RELATIVE_TIME_LABELS.PAST_SUFFIX;

  // 1년 이상 차이나면 절대 날짜 표시
  if (absDiff >= TIME_UNITS.YEAR) {
    return formatDate(date);
  }

  // 성능 최적화: 조건을 배열로 정의하여 반복문으로 처리
  const timeRanges = [
    { threshold: TIME_UNITS.MINUTE, unit: TIME_UNITS.MINUTE, label: RELATIVE_TIME_LABELS.UNITS.MINUTE },
    { threshold: TIME_UNITS.HOUR, unit: TIME_UNITS.HOUR, label: RELATIVE_TIME_LABELS.UNITS.HOUR },
    { threshold: TIME_UNITS.DAY, unit: TIME_UNITS.DAY, label: RELATIVE_TIME_LABELS.UNITS.DAY },
    { threshold: TIME_UNITS.WEEK, unit: TIME_UNITS.WEEK, label: RELATIVE_TIME_LABELS.UNITS.WEEK },
    { threshold: TIME_UNITS.MONTH, unit: TIME_UNITS.MONTH, label: RELATIVE_TIME_LABELS.UNITS.MONTH }
  ];

  // 1분 미만인 경우 특별 처리
  if (absDiff < TIME_UNITS.MINUTE) {
    return isFuture ? RELATIVE_TIME_LABELS.FUTURE_SOON : RELATIVE_TIME_LABELS.PAST_JUST_NOW;
  }

  // 적절한 시간 단위 찾기
  for (let i = 0; i < timeRanges.length; i++) {
    const { unit, label } = timeRanges[i];
    const nextThreshold = timeRanges[i + 1]?.threshold ?? TIME_UNITS.YEAR;

    if (absDiff < nextThreshold) {
      const value = Math.floor(absDiff / unit);
      return `${value}${label} ${suffix}`;
    }
  }

  // 폴백 (이론적으로 도달하지 않음)
  const months = Math.floor(absDiff / TIME_UNITS.MONTH);
  return `${months}${RELATIVE_TIME_LABELS.UNITS.MONTH} ${suffix}`;
}

/**
 * 문자열을 Date 객체로 파싱합니다
 * ISO 8601 형식과 다양한 구분자 형식을 지원합니다
 *
 * @param dateStr 파싱할 날짜 문자열
 * @returns 파싱된 Date 객체
 * @throws {Error} 유효하지 않은 날짜 형식인 경우
 */
export function parseDate(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') {
    throw new Error(ERROR_MESSAGES.INVALID_DATE_FORMAT);
  }

  let parsed: Date;

  // ISO 8601 형식 먼저 시도 (성능 최적화)
  if (dateStr.includes('T') || dateStr.includes('Z')) {
    parsed = new Date(dateStr);
  } else {
    // 다양한 형식 정규화 (한 번에 체이닝으로 처리)
    const normalizedStr = dateStr
      .replace(/\./g, '-')
      .replace(/\//g, '-');

    parsed = new Date(normalizedStr);
  }

  if (!isValidDate(parsed)) {
    throw new Error(ERROR_MESSAGES.INVALID_DATE_FORMAT);
  }

  return parsed;
}

/**
 * Date 객체가 유효한지 검증합니다
 * 타입 가드 함수로 TypeScript 타입 체크에도 활용됩니다
 *
 * @param date 검증할 값
 * @returns Date 객체이고 유효한 날짜인지 여부
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 두 날짜 간의 차이를 계산합니다
 * 다양한 시간 단위로 차이를 계산할 수 있습니다
 *
 * @param date1 시작 날짜
 * @param date2 종료 날짜
 * @param unit 계산할 시간 단위
 * @returns 지정된 단위로 계산된 차이값
 */
export function getDateDifference(date1: Date, date2: Date, unit: DateDifferenceUnit): number {
  if (!isValidDate(date1) || !isValidDate(date2)) {
    throw new Error(ERROR_MESSAGES.INVALID_DATE);
  }

  const diff = date2.getTime() - date1.getTime();
  const unitMs = getTimeUnitMs(unit);

  return unit === 'milliseconds' ? diff : Math.floor(diff / unitMs);
}

/**
 * 날짜 범위를 포맷합니다 (시작일-종료일 형태)
 * 같은 날인 경우 날짜는 한 번만 표시하고 시간 범위만 표시합니다
 *
 * @param startDate 시작 날짜 객체
 * @param endDate 종료 날짜 객체
 * @returns 포맷된 날짜 범위 문자열
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    throw new Error(ERROR_MESSAGES.INVALID_DATE);
  }

  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);

  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);

  // 같은 날인지 확인 (UTC 기준 비교)
  if (startFormatted === endFormatted) {
    return `${startFormatted} ${startTime} - ${endTime}`;
  }

  return `${startFormatted} ${startTime} - ${endFormatted} ${endTime}`;
}

/**
 * 시간만 포맷합니다 (HH:mm 형식)
 * 사용자의 로컬 시간대를 기준으로 표시합니다
 *
 * @param date 포맷할 날짜 객체
 * @returns HH:mm 형식의 시간 문자열
 */
function formatTime(date: Date): string {
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
}

/**
 * Unix 타임스탬프를 반환합니다 (밀리초 단위)
 * 날짜가 제공되지 않으면 현재 시간의 타임스탬프를 반환합니다
 *
 * @param date 타임스탬프를 구할 날짜 객체 (선택적)
 * @returns Unix 타임스탬프 (밀리초)
 */
export function getTimestamp(date?: Date): number {
  return date ? date.getTime() : Date.now();
}

/**
 * 주어진 날짜가 오늘인지 확인합니다
 * UTC 기준으로 비교하여 시간대 문제를 방지합니다
 *
 * @param date 확인할 날짜 객체
 * @param baseDate 기준 날짜 (기본값: 현재 시간)
 * @returns 주어진 날짜가 오늘인지 여부
 */
export function isToday(date: Date, baseDate: Date = new Date()): boolean {
  if (!isValidDate(date)) {
    return false;
  }

  return (
    date.getUTCFullYear() === baseDate.getUTCFullYear() &&
    date.getUTCMonth() === baseDate.getUTCMonth() &&
    date.getUTCDate() === baseDate.getUTCDate()
  );
}

/**
 * 주어진 날짜가 이번 주인지 확인합니다 (일요일 시작 기준)
 * UTC 시간대를 기준으로 주 경계를 계산합니다
 *
 * @param date 확인할 날짜 객체
 * @param baseDate 기준 날짜 (기본값: 현재 시간)
 * @returns 주어진 날짜가 이번 주인지 여부
 */
export function isThisWeek(date: Date, baseDate: Date = new Date()): boolean {
  if (!isValidDate(date)) {
    return false;
  }

  const startOfWeek = getStartOfWeek(baseDate);
  const endOfWeek = getEndOfWeek(baseDate);

  const targetTime = date.getTime();
  return targetTime >= startOfWeek.getTime() && targetTime <= endOfWeek.getTime();
}

/**
 * 주어진 날짜가 이번 달인지 확인합니다
 * UTC 기준으로 비교하여 시간대 문제를 방지합니다
 *
 * @param date 확인할 날짜 객체
 * @param baseDate 기준 날짜 (기본값: 현재 시간)
 * @returns 주어진 날짜가 이번 달인지 여부
 */
export function isThisMonth(date: Date, baseDate: Date = new Date()): boolean {
  if (!isValidDate(date)) {
    return false;
  }

  return (
    date.getUTCFullYear() === baseDate.getUTCFullYear() &&
    date.getUTCMonth() === baseDate.getUTCMonth()
  );
}

/**
 * 주의 시작일을 반환합니다 (일요일 00:00:00)
 * UTC 기준으로 계산하여 시간대 문제를 방지합니다
 *
 * @param date 기준 날짜 객체
 * @returns 해당 주의 시작일 (일요일 00:00:00 UTC)
 */
function getStartOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getUTCDay();
  const diff = result.getUTCDate() - day;
  result.setUTCDate(diff);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

/**
 * 주의 마지막일을 반환합니다 (토요일 23:59:59.999)
 * UTC 기준으로 계산하여 시간대 문제를 방지합니다
 *
 * @param date 기준 날짜 객체
 * @returns 해당 주의 마지막일 (토요일 23:59:59.999 UTC)
 */
function getEndOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getUTCDay();
  const diff = result.getUTCDate() + (6 - day);
  result.setUTCDate(diff);
  result.setUTCHours(23, 59, 59, 999);
  return result;
}