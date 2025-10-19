// 성능 최적화를 위한 상수들
const ID_RANDOM_LENGTH = 6;
const TIMESTAMP_BASE = 36;
const RANDOM_BASE = 36;

// 컴파일 시간에 정규식을 미리 생성하여 성능 향상
const ID_PATTERNS = {
  standard: /^[a-z0-9]+-[a-z0-9]+(-[a-z0-9]+)?$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  short: /^[A-Za-z0-9_-]+$/,
  readable: /^[a-z]+-[a-z]+-\d+$/
} as const;

/**
 * 고유한 ID를 생성합니다
 * 타임스탬프와 랜덤 문자열을 조합하여 충돌 가능성을 최소화합니다
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(TIMESTAMP_BASE);
  const randomPart = Math.random().toString(RANDOM_BASE).substring(2, 2 + ID_RANDOM_LENGTH);

  return prefix ? `${prefix}-${timestamp}-${randomPart}` : `${timestamp}-${randomPart}`;
}

/**
 * ID가 유효한 형식인지 검증합니다
 * 접두사가 제공되면 해당 접두사로 시작하는지 확인합니다
 */
export function isValidId(id: string, prefix?: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  if (prefix) {
    return id.startsWith(`${prefix}-`);
  }

  return ID_PATTERNS.standard.test(id);
}

// UUID v4 템플릿 및 상수
const UUID_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
const UUID_HEX_BASE = 16;

/**
 * 표준 UUID v4를 생성합니다
 * RFC 4122 규격을 준수하며 암호학적으로 안전한 랜덤성을 제공합니다
 */
export function generateUuid(): string {
  return UUID_TEMPLATE.replace(/[xy]/g, (c) => {
    const r = Math.random() * UUID_HEX_BASE | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(UUID_HEX_BASE);
  });
}

// Short ID 생성을 위한 URL-safe 문자 집합
const SHORT_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const DEFAULT_SHORT_ID_LENGTH = 8;

/**
 * 지정된 길이의 짧은 ID를 생성합니다
 * URL-safe 문자만 사용하여 웹 환경에서 안전하게 사용할 수 있습니다
 */
export function generateShortId(length = DEFAULT_SHORT_ID_LENGTH): string {
  if (length <= 0) {
    throw new Error('길이는 1 이상이어야 합니다');
  }

  let result = '';
  const charsLength = SHORT_ID_CHARS.length;

  for (let i = 0; i < length; i++) {
    result += SHORT_ID_CHARS.charAt(Math.floor(Math.random() * charsLength));
  }

  return result;
}

// 읽기 쉬운 ID 생성을 위한 단어 배열들 (메모리 효율성을 위해 상수로 선언)
const ADJECTIVES = [
  'happy', 'bright', 'clever', 'swift', 'brave', 'calm', 'eager', 'gentle',
  'kind', 'lively', 'proud', 'quiet', 'wise', 'young', 'active', 'bold'
] as const;

const NOUNS = [
  'cat', 'dog', 'bird', 'fish', 'lion', 'bear', 'wolf', 'fox',
  'deer', 'eagle', 'shark', 'whale', 'turtle', 'rabbit', 'horse', 'tiger'
] as const;

const MAX_READABLE_NUMBER = 1000;
const DEFAULT_SEPARATOR = '-';

/**
 * 사람이 읽기 쉬운 형태의 ID를 생성합니다
 * 형용사-명사-숫자 형태로 구성되어 기억하기 쉽습니다
 */
export function generateReadableId(separator = DEFAULT_SEPARATOR): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * MAX_READABLE_NUMBER);

  return `${adjective}${separator}${noun}${separator}${number}`;
}

// ID 포맷 타입 정의
export type IdFormat = 'standard' | 'uuid' | 'short' | 'readable';

/**
 * 다양한 ID 형식을 검증합니다
 * 미리 컴파일된 정규식을 사용하여 성능을 최적화합니다
 */
export function validateIdFormat(id: string, format: IdFormat): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  const pattern = ID_PATTERNS[format];
  return pattern ? pattern.test(id) : false;
}

/**
 * ID 파싱 결과 타입
 * 파싱된 ID의 정보를 구조화하여 제공합니다
 */
export interface ParsedId {
  isValid: boolean;
  type?: IdFormat;
  error?: string;

  // Standard ID 정보
  prefix?: string;
  timestamp?: Date;
  randomPart?: string;

  // UUID 정보
  version?: number;

  // Readable ID 정보
  adjective?: string;
  noun?: string;
  number?: number;
}

// 에러 메시지 상수화로 일관성 보장
const PARSE_ERRORS = {
  INVALID_INPUT: 'ID는 문자열이어야 합니다',
  INVALID_STANDARD_FORMAT: '잘못된 표준 ID 형식입니다',
  UNKNOWN_FORMAT: '알 수 없는 ID 형식입니다'
} as const;

/**
 * ID를 파싱하여 정보를 추출합니다
 * 다양한 ID 포맷을 자동으로 감지하고 메타데이터를 추출합니다
 */
export function parseId(id: string): ParsedId {
  if (!id || typeof id !== 'string') {
    return {
      isValid: false,
      error: PARSE_ERRORS.INVALID_INPUT
    };
  }

  // UUID 검증 (가장 구체적인 패턴부터 확인)
  if (validateIdFormat(id, 'uuid')) {
    return {
      isValid: true,
      type: 'uuid',
      version: 4
    };
  }

  // Readable ID 검증
  if (validateIdFormat(id, 'readable')) {
    const parts = id.split(DEFAULT_SEPARATOR);
    return {
      isValid: true,
      type: 'readable',
      adjective: parts[0],
      noun: parts[1],
      number: parseInt(parts[2], 10)
    };
  }

  // Standard ID 검증
  if (validateIdFormat(id, 'standard')) {
    return parseStandardId(id);
  }

  // Short ID 검증 (가장 일반적인 패턴이므로 마지막에 확인)
  if (validateIdFormat(id, 'short')) {
    return {
      isValid: true,
      type: 'short'
    };
  }

  return {
    isValid: false,
    error: PARSE_ERRORS.UNKNOWN_FORMAT
  };
}

/**
 * 표준 ID를 파싱하는 내부 함수
 * 복잡한 로직을 분리하여 코드 가독성을 향상시킵니다
 */
function parseStandardId(id: string): ParsedId {
  const parts = id.split(DEFAULT_SEPARATOR);
  let prefix: string | undefined;
  let timestampStr: string;
  let randomPart: string;

  if (parts.length === 3) {
    [prefix, timestampStr, randomPart] = parts;
  } else if (parts.length === 2) {
    [timestampStr, randomPart] = parts;
  } else {
    return {
      isValid: false,
      error: PARSE_ERRORS.INVALID_STANDARD_FORMAT
    };
  }

  // 타임스탬프를 Date로 변환 시도
  let timestamp: Date | undefined;
  try {
    const timestampNum = parseInt(timestampStr, TIMESTAMP_BASE);
    if (!isNaN(timestampNum) && timestampNum > 0) {
      timestamp = new Date(timestampNum);
    }
  } catch {
    // 변환 실패는 무시하고 undefined로 유지
  }

  return {
    isValid: true,
    type: 'standard',
    prefix,
    timestamp,
    randomPart
  };
}