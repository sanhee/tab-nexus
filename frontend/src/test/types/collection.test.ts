import { describe, test, expect } from 'vitest';
import type { Collection } from '../../types/index.js';
import { validateCollection, createCollection, isValidCollectionTitle } from '../../utils/collection.js';

describe('컬렉션 타입 검증', () => {
  test('유효한 컬렉션 객체를 검증할 수 있어야 한다', () => {
    const validCollection: Collection = {
      id: 'col-1',
      title: '개발 도구',
      isExpanded: true,
      sortOrder: 0,
      createdAt: new Date('2024-10-19'),
      updatedAt: new Date('2024-10-19'),
    };

    const result = validateCollection(validCollection);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test('필수 필드가 누락된 컬렉션은 유효하지 않아야 한다', () => {
    const invalidCollection = {
      id: 'col-1',
      // title 누락
      isExpanded: true,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Collection;

    const result = validateCollection(invalidCollection);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('title은 필수 항목입니다');
  });

  test('잘못된 타입의 필드가 있는 컬렉션은 유효하지 않아야 한다', () => {
    const invalidCollection = {
      id: 123, // string이어야 함
      title: '테스트',
      isExpanded: 'true', // boolean이어야 함
      sortOrder: '0', // number여야 함
      createdAt: '2024-10-19', // Date여야 함
      updatedAt: new Date(),
    } as unknown as Collection;

    const result = validateCollection(invalidCollection);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('컬렉션 생성', () => {
  test('새로운 컬렉션을 생성할 수 있어야 한다', () => {
    const title = '새 컬렉션';
    const collection = createCollection(title);

    expect(collection.id).toBeDefined();
    expect(collection.title).toBe(title);
    expect(collection.isExpanded).toBe(false);
    expect(collection.sortOrder).toBe(0);
    expect(collection.createdAt).toBeInstanceOf(Date);
    expect(collection.updatedAt).toBeInstanceOf(Date);
  });

  test('빈 제목으로는 컬렉션을 생성할 수 없어야 한다', () => {
    expect(() => createCollection('')).toThrow('title은 필수 항목입니다');
    expect(() => createCollection('   ')).toThrow('title은 최소 1자 이상이어야 합니다');
  });

  test('너무 긴 제목으로는 컬렉션을 생성할 수 없어야 한다', () => {
    const longTitle = 'a'.repeat(101); // 100자 초과
    expect(() => createCollection(longTitle)).toThrow('title은 최대 100자까지 입력할 수 있습니다');
  });
});

describe('컬렉션 제목 검증', () => {
  test('유효한 제목을 검증할 수 있어야 한다', () => {
    expect(isValidCollectionTitle('개발 도구')).toBe(true);
    expect(isValidCollectionTitle('My Collection 123')).toBe(true);
    expect(isValidCollectionTitle('한글제목')).toBe(true);
  });

  test('유효하지 않은 제목을 검증할 수 있어야 한다', () => {
    expect(isValidCollectionTitle('')).toBe(false);
    expect(isValidCollectionTitle('   ')).toBe(false);
    expect(isValidCollectionTitle('a'.repeat(101))).toBe(false);
  });

  test('특수문자가 포함된 제목을 검증할 수 있어야 한다', () => {
    expect(isValidCollectionTitle('개발-도구')).toBe(true);
    expect(isValidCollectionTitle('React & Vue')).toBe(true);
    expect(isValidCollectionTitle('컬렉션_1')).toBe(true);
  });
});