import { describe, test, expect } from 'vitest';
import type { Tab } from '../../types/index.js';
import { validateTab, createTab, isValidTabUrl, isValidTabTitle } from '../../utils/tab.js';

describe('탭 타입 검증', () => {
  test('유효한 링크 탭 객체를 검증할 수 있어야 한다', () => {
    const validTab: Tab = {
      id: 'tab-1',
      title: '구글',
      url: 'https://google.com',
      favicon: 'https://google.com/favicon.ico',
      description: '검색 엔진',
      collectionId: 'col-1',
      sortOrder: 0,
      type: 'link',
      tags: ['검색'],
      createdAt: new Date('2024-10-19').getTime(),
      updatedAt: new Date('2024-10-19').getTime(),
      lastVisited: new Date('2024-10-19').getTime(),
    };

    const result = validateTab(validTab);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test('유효한 노트 탭 객체를 검증할 수 있어야 한다', () => {
    const validNoteTab: Tab = {
      id: 'tab-2',
      title: '메모 노트',
      url: '',
      collectionId: 'col-1',
      sortOrder: 1,
      type: 'note',
      noteContent: '중요한 메모입니다.',
      tags: ['메모'],
      createdAt: new Date('2024-10-19').getTime(),
      updatedAt: new Date('2024-10-19').getTime(),
    };

    const result = validateTab(validNoteTab);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test('필수 필드가 누락된 탭은 유효하지 않아야 한다', () => {
    const invalidTab = {
      id: 'tab-1',
      // title 누락
      url: 'https://google.com',
      collectionId: 'col-1',
      sortOrder: 0,
      type: 'link',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as unknown as Tab;

    const result = validateTab(invalidTab);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('title은 필수 항목입니다');
  });

  test('잘못된 타입의 필드가 있는 탭은 유효하지 않아야 한다', () => {
    const invalidTab = {
      id: 123, // string이어야 함
      title: '테스트',
      url: 'invalid-url',
      collectionId: 'col-1',
      sortOrder: '0', // number여야 함
      type: 'invalid-type', // 'link' | 'note'여야 함
      tags: 'tag1,tag2', // string[]여야 함
      createdAt: '2024-10-19', // Date여야 함
      updatedAt: Date.now(),
    } as unknown as Tab;

    const result = validateTab(invalidTab);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('링크 타입 탭은 유효한 URL이 필요하다', () => {
    const invalidLinkTab: Tab = {
      id: 'tab-1',
      title: '테스트',
      url: 'not-a-valid-url',
      collectionId: 'col-1',
      sortOrder: 0,
      type: 'link',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = validateTab(invalidLinkTab);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('올바른 URL 형식이어야 합니다');
  });

  test('노트 타입 탭은 noteContent가 필요하다', () => {
    const invalidNoteTab: Tab = {
      id: 'tab-2',
      title: '노트',
      url: '',
      collectionId: 'col-1',
      sortOrder: 0,
      type: 'note',
      // noteContent 누락
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = validateTab(invalidNoteTab);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('노트 타입 탭은 noteContent가 필요합니다');
  });
});

describe('탭 생성', () => {
  test('링크 타입 탭을 생성할 수 있어야 한다', () => {
    const tabData = {
      title: '구글',
      url: 'https://google.com',
      collectionId: 'col-1',
      type: 'link' as const,
    };

    const tab = createTab(tabData);

    expect(tab.id).toBeDefined();
    expect(tab.title).toBe(tabData.title);
    expect(tab.url).toBe(tabData.url);
    expect(tab.collectionId).toBe(tabData.collectionId);
    expect(tab.type).toBe('link');
    expect(tab.sortOrder).toBe(0);
    expect(tab.tags).toEqual([]);
    expect(typeof tab.createdAt).toBe('number');
    expect(typeof tab.updatedAt).toBe('number');
    expect(tab.createdAt).toBeGreaterThan(0);
    expect(tab.updatedAt).toBeGreaterThan(0);
  });

  test('노트 타입 탭을 생성할 수 있어야 한다', () => {
    const tabData = {
      title: '새 노트',
      collectionId: 'col-1',
      type: 'note' as const,
      noteContent: '노트 내용입니다.',
    };

    const tab = createTab(tabData);

    expect(tab.id).toBeDefined();
    expect(tab.title).toBe(tabData.title);
    expect(tab.url).toBe('');
    expect(tab.collectionId).toBe(tabData.collectionId);
    expect(tab.type).toBe('note');
    expect(tab.noteContent).toBe(tabData.noteContent);
    expect(tab.sortOrder).toBe(0);
    expect(typeof tab.createdAt).toBe('number');
    expect(typeof tab.updatedAt).toBe('number');
    expect(tab.createdAt).toBeGreaterThan(0);
    expect(tab.updatedAt).toBeGreaterThan(0);
  });

  test('잘못된 URL로는 링크 탭을 생성할 수 없어야 한다', () => {
    const tabData = {
      title: '테스트',
      url: 'invalid-url',
      collectionId: 'col-1',
      type: 'link' as const,
    };

    expect(() => createTab(tabData)).toThrow('올바른 URL 형식이어야 합니다');
  });

  test('빈 제목으로는 탭을 생성할 수 없어야 한다', () => {
    const tabData = {
      title: '',
      url: 'https://google.com',
      collectionId: 'col-1',
      type: 'link' as const,
    };

    expect(() => createTab(tabData)).toThrow('title은 필수 항목입니다');
  });

  test('노트 타입 탭은 noteContent 없이 생성할 수 없어야 한다', () => {
    const tabData = {
      title: '노트',
      collectionId: 'col-1',
      type: 'note' as const,
      // noteContent 누락
    };

    expect(() => createTab(tabData)).toThrow('노트 타입 탭은 noteContent가 필요합니다');
  });
});

describe('탭 URL 검증', () => {
  test('유효한 URL을 검증할 수 있어야 한다', () => {
    expect(isValidTabUrl('https://google.com')).toBe(true);
    expect(isValidTabUrl('http://example.com')).toBe(true);
    expect(isValidTabUrl('https://www.naver.com')).toBe(true);
    expect(isValidTabUrl('https://github.com/user/repo')).toBe(true);
  });

  test('유효하지 않은 URL을 검증할 수 있어야 한다', () => {
    expect(isValidTabUrl('not-a-url')).toBe(false);
    expect(isValidTabUrl('google.com')).toBe(false); // 프로토콜 없음
    expect(isValidTabUrl('ftp://example.com')).toBe(false); // http/https만 허용
    expect(isValidTabUrl('')).toBe(false);
    expect(isValidTabUrl('   ')).toBe(false);
  });

  test('노트 타입의 경우 빈 URL도 유효해야 한다', () => {
    expect(isValidTabUrl('', 'note')).toBe(true);
  });
});

describe('탭 제목 검증', () => {
  test('유효한 제목을 검증할 수 있어야 한다', () => {
    expect(isValidTabTitle('구글')).toBe(true);
    expect(isValidTabTitle('React 문서')).toBe(true);
    expect(isValidTabTitle('My Tab 123')).toBe(true);
    expect(isValidTabTitle('한글제목')).toBe(true);
  });

  test('유효하지 않은 제목을 검증할 수 있어야 한다', () => {
    expect(isValidTabTitle('')).toBe(false);
    expect(isValidTabTitle('   ')).toBe(false);
    expect(isValidTabTitle('a'.repeat(201))).toBe(false); // 200자 초과
  });

  test('특수문자가 포함된 제목을 검증할 수 있어야 한다', () => {
    expect(isValidTabTitle('React & Vue')).toBe(true);
    expect(isValidTabTitle('탭-제목')).toBe(true);
    expect(isValidTabTitle('탭_제목_1')).toBe(true);
    expect(isValidTabTitle('탭(노트)')).toBe(true);
  });
});