import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateId,
  isValidId,
  generateUuid,
  generateShortId,
  generateReadableId,
  validateIdFormat,
  parseId
} from '../../utils/id.js';

describe('ID 생성 유틸리티', () => {
  beforeEach(() => {
    // 시간 기반 테스트를 위한 Date mock
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-10-20T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('고유한 ID를 생성해야 한다', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
  });

  test('접두사가 있는 ID를 생성할 수 있어야 한다', () => {
    const id = generateId('user');

    expect(id).toMatch(/^user-/);
    expect(id.split('-')).toHaveLength(3); // user-timestamp-random
  });

  test('1000개의 ID를 생성해도 모두 고유해야 한다', () => {
    const ids = new Set();

    for (let i = 0; i < 1000; i++) {
      const id = generateId();
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }

    expect(ids.size).toBe(1000);
  });

  test('생성된 ID의 길이가 적절해야 한다', () => {
    const id = generateId();

    expect(id.length).toBeGreaterThan(10);
    expect(id.length).toBeLessThan(30);
  });

  test('ID에 특수문자가 포함되지 않아야 한다', () => {
    const id = generateId();

    expect(id).toMatch(/^[a-z0-9-]+$/);
    expect(id).not.toMatch(/[A-Z]/);
    expect(id).not.toMatch(/[^a-z0-9-]/);
  });
});

describe('UUID 생성기', () => {
  test('표준 UUID v4 형식을 생성해야 한다', () => {
    const uuid = generateUuid();

    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  test('생성된 UUID는 모두 고유해야 한다', () => {
    const uuids = new Set();

    for (let i = 0; i < 100; i++) {
      const uuid = generateUuid();
      expect(uuids.has(uuid)).toBe(false);
      uuids.add(uuid);
    }

    expect(uuids.size).toBe(100);
  });
});

describe('짧은 ID 생성기', () => {
  test('지정된 길이의 짧은 ID를 생성해야 한다', () => {
    const shortId8 = generateShortId(8);
    const shortId12 = generateShortId(12);

    expect(shortId8.length).toBe(8);
    expect(shortId12.length).toBe(12);
  });

  test('기본 길이는 8자여야 한다', () => {
    const shortId = generateShortId();

    expect(shortId.length).toBe(8);
  });

  test('짧은 ID는 URL-safe 문자만 사용해야 한다', () => {
    const shortId = generateShortId(16);

    expect(shortId).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  test('1000개의 짧은 ID를 생성해도 충돌이 거의 없어야 한다', () => {
    const shortIds = new Set();

    for (let i = 0; i < 1000; i++) {
      const shortId = generateShortId(12);
      shortIds.add(shortId);
    }

    // 12자 길이에서 1000개 생성 시 충돌률 < 1%
    expect(shortIds.size).toBeGreaterThan(990);
  });
});

describe('읽기 쉬운 ID 생성기', () => {
  test('사람이 읽기 쉬운 형태의 ID를 생성해야 한다', () => {
    const readableId = generateReadableId();

    // 형식: adjective-noun-number (예: happy-cat-123)
    expect(readableId).toMatch(/^[a-z]+-[a-z]+-\d+$/);
  });

  test('읽기 쉬운 ID의 구성 요소를 검증할 수 있어야 한다', () => {
    const readableId = generateReadableId();
    const parts = readableId.split('-');

    expect(parts).toHaveLength(3);
    expect(parts[0]).toMatch(/^[a-z]+$/); // 형용사
    expect(parts[1]).toMatch(/^[a-z]+$/); // 명사
    expect(parts[2]).toMatch(/^\d+$/);    // 숫자
  });

  test('커스텀 구분자를 사용할 수 있어야 한다', () => {
    const readableId = generateReadableId('_');

    expect(readableId).toMatch(/^[a-z]+_[a-z]+_\d+$/);
  });
});

describe('ID 형식 검증', () => {
  test('다양한 ID 형식을 검증할 수 있어야 한다', () => {
    expect(validateIdFormat('user-123-abc', 'standard')).toBe(true);
    expect(validateIdFormat('550e8400-e29b-41d4-a716-446655440000', 'uuid')).toBe(true);
    expect(validateIdFormat('AbC12XyZ', 'short')).toBe(true);
    expect(validateIdFormat('happy-cat-123', 'readable')).toBe(true);
  });

  test('잘못된 형식을 거부해야 한다', () => {
    expect(validateIdFormat('invalid', 'standard')).toBe(false);
    expect(validateIdFormat('not-a-uuid', 'uuid')).toBe(false);
    expect(validateIdFormat('too@short!', 'short')).toBe(false);
    expect(validateIdFormat('BadFormat123', 'readable')).toBe(false);
  });

  test('빈 문자열이나 null을 거부해야 한다', () => {
    expect(validateIdFormat('', 'standard')).toBe(false);
    expect(validateIdFormat(null as any, 'uuid')).toBe(false);
    expect(validateIdFormat(undefined as any, 'short')).toBe(false);
  });
});

describe('ID 파싱', () => {
  test('표준 ID에서 정보를 추출할 수 있어야 한다', () => {
    // 고정된 시간으로 테스트
    const id = 'user-' + Date.now().toString(36) + '-abc123';
    const parsed = parseId(id);

    expect(parsed.prefix).toBe('user');
    expect(parsed.timestamp).toBeInstanceOf(Date);
    expect(parsed.randomPart).toBe('abc123');
    expect(parsed.isValid).toBe(true);
  });

  test('UUID에서 정보를 추출할 수 있어야 한다', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const parsed = parseId(uuid);

    expect(parsed.type).toBe('uuid');
    expect(parsed.version).toBe(4);
    expect(parsed.isValid).toBe(true);
  });

  test('읽기 쉬운 ID에서 정보를 추출할 수 있어야 한다', () => {
    const readableId = 'happy-cat-123';
    const parsed = parseId(readableId);

    expect(parsed.type).toBe('readable');
    expect(parsed.adjective).toBe('happy');
    expect(parsed.noun).toBe('cat');
    expect(parsed.number).toBe(123);
    expect(parsed.isValid).toBe(true);
  });

  test('잘못된 ID 형식에 대해 실패 정보를 반환해야 한다', () => {
    const parsed = parseId('invalid-id-format-###');

    expect(parsed.isValid).toBe(false);
    expect(parsed.error).toBeDefined();
  });
});

describe('ID 생성 성능 테스트', () => {
  test('1만개 ID 생성이 1초 이내에 완료되어야 한다', () => {
    const startTime = Date.now();

    for (let i = 0; i < 10000; i++) {
      generateId();
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(1000); // 1초
  });

  test('UUID 생성도 적절한 성능을 보여야 한다', () => {
    const startTime = Date.now();

    for (let i = 0; i < 1000; i++) {
      generateUuid();
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(500); // 0.5초
  });
});

describe('ID 충돌 방지', () => {
  test('동시에 생성된 ID들이 충돌하지 않아야 한다', async () => {
    const promises = Array.from({ length: 100 }, () =>
      Promise.resolve(generateId())
    );

    const ids = await Promise.all(promises);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(100);
  });

  test('같은 접두사로 생성된 ID들도 충돌하지 않아야 한다', () => {
    const ids = Array.from({ length: 100 }, () => generateId('user'));
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(100);
  });
});