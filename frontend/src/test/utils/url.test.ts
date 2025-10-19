import { describe, test, expect } from 'vitest';
import {
  isValidUrl,
  extractDomain,
  normalizeUrl,
  isSafeUrl,
  parseUrl,
  validateUrlFormat
} from '../../utils/url.js';

describe('URL 검증 유틸리티', () => {
  test('유효한 HTTP URL을 검증할 수 있어야 한다', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('https://www.google.com')).toBe(true);
  });

  test('유효한 HTTPS URL을 검증할 수 있어야 한다', () => {
    expect(isValidUrl('https://secure.example.com')).toBe(true);
    expect(isValidUrl('https://api.github.com/users')).toBe(true);
  });

  test('잘못된 URL 형식을 거부해야 한다', () => {
    expect(isValidUrl('invalid-url')).toBe(false);
    expect(isValidUrl('ftp://example.com')).toBe(false);
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl(null as any)).toBe(false);
  });

  test('포트 번호가 있는 URL을 검증할 수 있어야 한다', () => {
    expect(isValidUrl('https://localhost:3000')).toBe(true);
    expect(isValidUrl('http://192.168.1.1:8080')).toBe(true);
  });

  test('쿼리 파라미터가 있는 URL을 검증할 수 있어야 한다', () => {
    expect(isValidUrl('https://example.com?param=value')).toBe(true);
    expect(isValidUrl('https://search.com?q=test&page=1')).toBe(true);
  });

  test('경로가 있는 URL을 검증할 수 있어야 한다', () => {
    expect(isValidUrl('https://example.com/path/to/page')).toBe(true);
    expect(isValidUrl('https://api.example.com/v1/users/123')).toBe(true);
  });
});

describe('도메인 추출 유틸리티', () => {
  test('URL에서 도메인을 추출할 수 있어야 한다', () => {
    expect(extractDomain('https://www.google.com')).toBe('google.com');
    expect(extractDomain('http://example.com')).toBe('example.com');
    expect(extractDomain('https://api.github.com/users')).toBe('github.com');
  });

  test('서브도메인이 있는 URL에서 메인 도메인을 추출해야 한다', () => {
    expect(extractDomain('https://blog.example.com')).toBe('example.com');
    expect(extractDomain('https://api.v2.service.com')).toBe('service.com');
  });

  test('포트 번호를 제거하고 도메인을 추출해야 한다', () => {
    expect(extractDomain('https://localhost:3000')).toBe('localhost');
    expect(extractDomain('http://example.com:8080')).toBe('example.com');
  });

  test('잘못된 URL에 대해 null을 반환해야 한다', () => {
    expect(extractDomain('invalid-url')).toBeNull();
    expect(extractDomain('')).toBeNull();
  });
});

describe('URL 정규화 유틸리티', () => {
  test('URL을 정규화할 수 있어야 한다', () => {
    expect(normalizeUrl('HTTPS://EXAMPLE.COM')).toBe('https://example.com');
    expect(normalizeUrl('http://example.com/')).toBe('http://example.com');
  });

  test('중복된 슬래시를 제거해야 한다', () => {
    expect(normalizeUrl('https://example.com//path//to//page')).toBe('https://example.com/path/to/page');
  });

  test('기본 포트를 제거해야 한다', () => {
    expect(normalizeUrl('https://example.com:443')).toBe('https://example.com');
    expect(normalizeUrl('http://example.com:80')).toBe('http://example.com');
  });

  test('쿼리 파라미터를 정렬해야 한다', () => {
    expect(normalizeUrl('https://example.com?b=2&a=1')).toBe('https://example.com?a=1&b=2');
  });

  test('fragment를 제거해야 한다', () => {
    expect(normalizeUrl('https://example.com/page#section')).toBe('https://example.com/page');
  });
});

describe('안전한 URL 검증', () => {
  test('안전한 프로토콜만 허용해야 한다', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('http://example.com')).toBe(true);
  });

  test('위험한 프로토콜을 거부해야 한다', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
  });

  test('의심스러운 도메인을 감지해야 한다', () => {
    expect(isSafeUrl('https://localhost')).toBe(false);
    expect(isSafeUrl('https://127.0.0.1')).toBe(false);
    expect(isSafeUrl('https://192.168.1.1')).toBe(false);
  });

  test('신뢰할 수 있는 도메인을 허용해야 한다', () => {
    expect(isSafeUrl('https://google.com')).toBe(true);
    expect(isSafeUrl('https://github.com')).toBe(true);
    expect(isSafeUrl('https://stackoverflow.com')).toBe(true);
  });
});

describe('URL 파싱 유틸리티', () => {
  test('URL을 구성 요소로 파싱할 수 있어야 한다', () => {
    const parsed = parseUrl('https://user:pass@example.com:8080/path?query=value#fragment');

    expect(parsed).not.toBeNull();
    if (parsed) {
      expect(parsed.protocol).toBe('https:');
      expect(parsed.hostname).toBe('example.com');
      expect(parsed.port).toBe('8080');
      expect(parsed.pathname).toBe('/path');
      expect(parsed.search).toBe('?query=value');
      expect(parsed.hash).toBe('#fragment');
      expect(parsed.origin).toBe('https://example.com:8080');
    }
  });

  test('기본 URL을 파싱할 수 있어야 한다', () => {
    const parsed = parseUrl('https://example.com');

    expect(parsed).not.toBeNull();
    if (parsed) {
      expect(parsed.protocol).toBe('https:');
      expect(parsed.hostname).toBe('example.com');
      expect(parsed.port).toBe('');
      expect(parsed.pathname).toBe('/');
    }
  });

  test('잘못된 URL에 대해 null을 반환해야 한다', () => {
    expect(parseUrl('invalid-url')).toBeNull();
    expect(parseUrl('')).toBeNull();
  });
});

describe('URL 형식 세부 검증', () => {
  test('이메일 형식의 URL을 거부해야 한다', () => {
    expect(validateUrlFormat('mailto:test@example.com')).toBe(false);
  });

  test('전화번호 형식의 URL을 거부해야 한다', () => {
    expect(validateUrlFormat('tel:+1234567890')).toBe(false);
  });

  test('상대 경로를 거부해야 한다', () => {
    expect(validateUrlFormat('/relative/path')).toBe(false);
    expect(validateUrlFormat('../parent/path')).toBe(false);
  });

  test('유니코드 도메인을 처리할 수 있어야 한다', () => {
    expect(validateUrlFormat('https://한국.com')).toBe(true);
    expect(validateUrlFormat('https://xn--3e0b707e.com')).toBe(true); // 퓨니코드
  });

  test('매우 긴 URL을 처리할 수 있어야 한다', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(2000);
    expect(validateUrlFormat(longUrl)).toBe(true);
  });

  test('URL 길이 제한을 확인해야 한다', () => {
    const tooLongUrl = 'https://example.com/' + 'a'.repeat(10000);
    expect(validateUrlFormat(tooLongUrl)).toBe(false);
  });
});

describe('URL 검증 성능 테스트', () => {
  test('1000개의 URL 검증이 빠르게 처리되어야 한다', () => {
    const urls = Array.from({ length: 1000 }, (_, i) => `https://example${i}.com`);

    const startTime = Date.now();
    urls.forEach(url => isValidUrl(url));
    const endTime = Date.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(100); // 100ms 이내
  });

  test('복잡한 URL 파싱 성능이 적절해야 한다', () => {
    const complexUrl = 'https://user:pass@subdomain.example.com:8080/very/long/path/with/many/segments?param1=value1&param2=value2&param3=value3#section';

    const startTime = Date.now();
    for (let i = 0; i < 100; i++) {
      parseUrl(complexUrl);
    }
    const endTime = Date.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(50); // 50ms 이내
  });
});

describe('URL 엣지 케이스', () => {
  test('빈 문자열과 null 처리', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl(null as any)).toBe(false);
    expect(isValidUrl(undefined as any)).toBe(false);
  });

  test('매우 특수한 valid URL 처리', () => {
    expect(isValidUrl('https://xn--fsq.xn--0zwm56d')).toBe(true); // 국제화 도메인
    expect(isValidUrl('https://example.com:65535')).toBe(true); // 최대 포트
  });

  test('경계값 테스트', () => {
    expect(isValidUrl('https://a.b')).toBe(true); // 최소 도메인
    expect(isValidUrl('https://example.com:0')).toBe(false); // 잘못된 포트
    expect(isValidUrl('https://example.com:99999')).toBe(false); // 포트 범위 초과
  });
});