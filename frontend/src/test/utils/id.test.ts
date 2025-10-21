import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateId,
  generateTabId,
  generateCollectionId,
  generateShortId,
  isValidId,
  extractPrefix
} from '../../utils/id.js';

describe('ID 생성 유틸리티', () => {
  beforeEach(() => {
    // 시간 기반 테스트를 위한 Date mock
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('기본 UUID를 생성할 수 있어야 한다', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
    expect(id2.length).toBeGreaterThan(0);
  });

  test('탭 ID를 생성할 수 있어야 한다', () => {
    const tabId = generateTabId();
    const customTabId = generateTabId('user');

    expect(tabId).toMatch(/^tab-/);
    expect(customTabId).toMatch(/^user-/);
  });

  test('컬렉션 ID를 생성할 수 있어야 한다', () => {
    const colId = generateCollectionId();
    const customColId = generateCollectionId('project');

    expect(colId).toMatch(/^col-/);
    expect(customColId).toMatch(/^project-/);
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
});

describe('짧은 ID 생성기', () => {
  test('8자리 짧은 ID를 생성해야 한다', () => {
    const shortId = generateShortId();

    expect(shortId.length).toBe(8);
  });

  test('짧은 ID는 영숫자만 사용해야 한다', () => {
    const shortId = generateShortId();

    expect(shortId).toMatch(/^[a-z0-9]+$/);
  });

  test('1000개의 짧은 ID를 생성해도 충돌이 거의 없어야 한다', () => {
    const shortIds = new Set();

    for (let i = 0; i < 1000; i++) {
      const shortId = generateShortId();
      shortIds.add(shortId);
    }

    // 8자 길이에서 1000개 생성 시 충돌이 있을 수 있지만 대부분 고유해야 함
    expect(shortIds.size).toBeGreaterThan(900);
  });
});

describe('ID 유효성 검증', () => {
  test('다양한 ID 형식을 검증할 수 있어야 한다', () => {
    // UUID 형식 (실제로 생성된 ID로 테스트)
    const uuid = generateId();
    expect(isValidId(uuid)).toBe(true);

    // 접두사가 있는 UUID
    const tabId = generateTabId();
    const colId = generateCollectionId();
    expect(isValidId(tabId)).toBe(true);
    expect(isValidId(colId)).toBe(true);
  });

  test('잘못된 형식을 거부해야 한다', () => {
    expect(isValidId('')).toBe(false);
    expect(isValidId('invalid')).toBe(false);
    expect(isValidId('not-a-uuid')).toBe(false);
    expect(isValidId('too@short!')).toBe(false);
  });
});

describe('ID 접두사 추출', () => {
  test('접두사를 올바르게 추출해야 한다', () => {
    const tabId = generateTabId();
    const colId = generateCollectionId();
    const customId = generateTabId('user');

    expect(extractPrefix(tabId)).toBe('tab');
    expect(extractPrefix(colId)).toBe('col');
    expect(extractPrefix(customId)).toBe('user');
  });

  test('접두사가 없으면 null을 반환해야 한다', () => {
    const uuid = generateId();
    expect(extractPrefix(uuid)).toBe(null);
    expect(extractPrefix('invalid')).toBe(null);
  });
});