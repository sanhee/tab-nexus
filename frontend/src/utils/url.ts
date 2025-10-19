/**
 * URL 검증 및 처리 유틸리티
 * 다양한 URL 검증, 파싱, 정규화 기능을 제공합니다
 *
 * 특징:
 * - HTTP/HTTPS 프로토콜 지원
 * - 보안 검증으로 안전하지 않은 프로토콜 차단
 * - 도메인 추출 및 정규화
 * - 성능 최적화된 검증 로직
 * - 엄격한 타입 안전성
 */

// 성능 최적화를 위한 미리 컴파일된 정규식 패턴
const URL_PATTERNS = {
  // HTTP/HTTPS 프로토콜 기본 검증 (대소문자 무관)
  basic: /^https?:\/\/.+/i,
  // 위험한 프로토콜 감지 (보안 검증용)
  dangerous: /^(?:javascript|data|file|vbscript|blob):/i,
  // 로컬/사설 IP 주소 패턴 (RFC 1918, 루프백)
  localIp: /^(?:127\.|192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.|localhost$)/i,
  // IPv4 주소 패턴
  ipv4: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  // 특수 프로토콜 (이메일, 전화 등)
  specialProtocol: /^(?:mailto|tel|sms|fax):/i,
  // 상대 경로 패턴
  relativePath: /^\.{0,2}\//
} as const;

// 에러 메시지 상수화 (일관성 및 국제화 준비)
const URL_ERRORS = {
  INVALID_URL: 'URL 형식이 올바르지 않습니다',
  UNSAFE_PROTOCOL: '안전하지 않은 프로토콜입니다',
  INVALID_DOMAIN: '유효하지 않은 도메인입니다',
  URL_TOO_LONG: 'URL이 너무 깁니다',
  INVALID_PORT: '유효하지 않은 포트 번호입니다'
} as const;

// URL 관련 상수들 (성능 및 유지보수성 향상)
const URL_CONSTANTS = {
  // RFC 3986 권장 최대 길이
  MAX_LENGTH: 8192,
  // 포트 번호 유효 범위
  MIN_PORT: 1,
  MAX_PORT: 65535,
  // 기본 포트 매핑
  DEFAULT_PORTS: {
    'http:': '80',
    'https:': '443'
  }
} as const;

// 유틸리티 헬퍼 함수들 (내부 로직 최적화)
/**
 * 포트 번호가 유효한 범위인지 검증합니다
 * @param port 검증할 포트 문자열
 * @returns 포트 번호가 유효한지 여부
 */
function isValidPort(port: string): boolean {
  const portNumber = parseInt(port, 10);
  return !isNaN(portNumber) &&
         portNumber >= URL_CONSTANTS.MIN_PORT &&
         portNumber <= URL_CONSTANTS.MAX_PORT;
}

/**
 * 호스트명이 IP 주소인지 확인합니다
 * @param hostname 확인할 호스트명
 * @returns IP 주소인지 여부
 */
function isIpAddress(hostname: string): boolean {
  return URL_PATTERNS.ipv4.test(hostname);
}

/**
 * URL이 유효한 HTTP/HTTPS 형식인지 검증합니다
 * 기본적인 프로토콜과 구조를 확인합니다
 *
 * @param url 검증할 URL 문자열
 * @returns URL이 유효한지 여부
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // 기본 패턴 검증
  if (!URL_PATTERNS.basic.test(url)) {
    return false;
  }

  try {
    // URL 생성자로 실제 파싱 검증
    const parsedUrl = new URL(url);

    // HTTP/HTTPS만 허용
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false;
    }

    // 포트 범위 검증 (헬퍼 함수 사용으로 로직 단순화)
    if (parsedUrl.port && !isValidPort(parsedUrl.port)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * URL에서 메인 도메인을 추출합니다
 * www와 서브도메인을 제거하고 순수한 도메인만 반환합니다
 *
 * @param url 도메인을 추출할 URL
 * @returns 추출된 도메인 또는 null (실패시)
 */
export function extractDomain(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;

    // www 제거
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }

    // 로컬호스트는 그대로 반환
    if (hostname === 'localhost') {
      return hostname;
    }

    // IP 주소는 그대로 반환 (헬퍼 함수 사용)
    if (isIpAddress(hostname)) {
      return hostname;
    }

    // 서브도메인 제거 (최소 2개 부분이 있는 경우만)
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }

    return hostname;
  } catch {
    return null;
  }
}

/**
 * URL을 정규화합니다
 * 대소문자, 중복 슬래시, 기본 포트, 쿼리 파라미터 정렬 등을 처리합니다
 *
 * @param url 정규화할 URL
 * @returns 정규화된 URL
 */
export function normalizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return url;
  }

  try {
    const parsedUrl = new URL(url);

    // 프로토콜과 호스트명 소문자로 변환
    parsedUrl.protocol = parsedUrl.protocol.toLowerCase();
    parsedUrl.hostname = parsedUrl.hostname.toLowerCase();

    // 기본 포트 제거
    if (parsedUrl.port === URL_CONSTANTS.DEFAULT_PORTS[parsedUrl.protocol as keyof typeof URL_CONSTANTS.DEFAULT_PORTS]) {
      parsedUrl.port = '';
    }

    // 중복 슬래시 제거
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/+/g, '/');

    // 끝의 슬래시 제거 (루트 경로가 아닌 경우)
    if (parsedUrl.pathname.length > 1 && parsedUrl.pathname.endsWith('/')) {
      parsedUrl.pathname = parsedUrl.pathname.slice(0, -1);
    }

    // 쿼리 파라미터 정렬
    if (parsedUrl.searchParams) {
      const sortedParams = new URLSearchParams();
      const keys = Array.from(parsedUrl.searchParams.keys()).sort();

      for (const key of keys) {
        const values = parsedUrl.searchParams.getAll(key);
        for (const value of values) {
          sortedParams.append(key, value);
        }
      }

      parsedUrl.search = sortedParams.toString();
    }

    // fragment 제거
    parsedUrl.hash = '';

    let result = parsedUrl.toString();

    // 불필요한 후행 슬래시 제거
    // 1. 도메인 바로 뒤의 슬래시 (경로가 없고 쿼리나 해시가 없을 때)
    if (result === parsedUrl.origin + '/') {
      result = parsedUrl.origin;
    }

    // 2. 루트 경로에서 쿼리 파라미터가 있을 때의 슬래시 제거
    if (parsedUrl.pathname === '/' && parsedUrl.search) {
      result = result.replace('/?', '?');
    }

    return result;
  } catch {
    return url;
  }
}

/**
 * URL이 안전한지 검증합니다
 * 위험한 프로토콜과 로컬 네트워크 주소를 차단합니다
 *
 * @param url 검증할 URL
 * @returns URL이 안전한지 여부
 */
export function isSafeUrl(url: string): boolean {
  if (!isValidUrl(url)) {
    return false;
  }

  // 위험한 프로토콜 검사
  if (URL_PATTERNS.dangerous.test(url)) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);

    // 로컬 IP 주소 차단
    if (URL_PATTERNS.localIp.test(parsedUrl.hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * URL 파싱 결과 타입
 */
export interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

/**
 * URL을 구성 요소별로 파싱합니다
 * URL의 각 부분을 구조화된 객체로 반환합니다
 *
 * @param url 파싱할 URL
 * @returns 파싱된 URL 정보 또는 null (실패시)
 */
export function parseUrl(url: string): ParsedUrl | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    return {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      pathname: parsedUrl.pathname,
      search: parsedUrl.search,
      hash: parsedUrl.hash,
      origin: parsedUrl.origin
    };
  } catch {
    return null;
  }
}

/**
 * URL 형식의 세부적인 검증을 수행합니다
 * 길이 제한, 특수 프로토콜 차단 등 추가 검증을 포함합니다
 *
 * @param url 검증할 URL
 * @returns URL 형식이 유효한지 여부
 */
export function validateUrlFormat(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // 길이 제한 검사
  if (url.length > URL_CONSTANTS.MAX_LENGTH) {
    return false;
  }

  // 특수 프로토콜 차단 (상수 사용으로 유지보수성 향상)
  if (URL_PATTERNS.specialProtocol.test(url)) {
    return false;
  }

  // 상대 경로 차단 (정규식 패턴 사용으로 정확성 향상)
  if (URL_PATTERNS.relativePath.test(url)) {
    return false;
  }

  // 기본 URL 검증
  if (!isValidUrl(url)) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);

    // 포트 범위 검증 (헬퍼 함수 사용으로 로직 단순화)
    if (parsedUrl.port && !isValidPort(parsedUrl.port)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}