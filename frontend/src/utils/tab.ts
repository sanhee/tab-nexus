import type { Tab } from '../types/index.js';
import { generateId } from './id.js';
import {
  createValidationError,
  validate,
  required,
  typeCheck,
  dateCheck,
  stringLength,
  type ValidationResult
} from './validation.js';

/**
 * 탭 객체의 유효성을 검증합니다
 */
export function validateTab(tab: Tab): ValidationResult {
  const errors: string[] = [];

  // 공통 검증 규칙을 사용한 기본 필드 검증
  const basicValidations = [
    validate(tab.id, [required('id'), typeCheck('string', 'id')]),
    validate(tab.title, [required('title'), typeCheck('string', 'title'), stringLength(1, 200, 'title')]),
    validate(tab.url, [typeCheck('string', 'url')]),
    validate(tab.collectionId, [required('collectionId'), typeCheck('string', 'collectionId')]),
    validate(tab.sortOrder, [typeCheck('number', 'sortOrder')]),
    validate(tab.createdAt, [dateCheck('createdAt')]),
    validate(tab.updatedAt, [dateCheck('updatedAt')]),
  ];

  // 기본 검증 결과 수집
  basicValidations.forEach(result => {
    errors.push(...result.errors);
  });

  // 타입 특별 검증
  const typeValidation = validateTabType(tab);
  errors.push(...typeValidation.errors);

  // 태그 배열 검증
  if (!Array.isArray(tab.tags)) {
    errors.push('tags는 배열이어야 합니다');
  } else if (tab.tags.some(tag => typeof tag !== 'string')) {
    errors.push('모든 태그는 문자열이어야 합니다');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 탭 타입별 특별 검증을 수행합니다
 */
function validateTabType(tab: Tab): ValidationResult {
  const errors: string[] = [];

  if (!isValidTabType(tab.type)) {
    errors.push('type은 link 또는 note여야 합니다');
    return { isValid: false, errors }; // 타입이 잘못되면 추가 검증 중단
  }

  switch (tab.type) {
    case 'link':
      if (!isValidTabUrl(tab.url)) {
        errors.push('올바른 URL 형식이어야 합니다');
      }
      // 링크 타입에서는 noteContent가 있으면 안됨
      if (tab.noteContent !== undefined) {
        errors.push('link 타입 탭은 noteContent를 가질 수 없습니다');
      }
      break;

    case 'note':
      if (!tab.noteContent || typeof tab.noteContent !== 'string') {
        errors.push('노트 타입 탭은 noteContent가 필요합니다');
      } else if (tab.noteContent.trim().length === 0) {
        errors.push('노트 내용은 최소 1자 이상이어야 합니다');
      }
      // 노트 타입에서는 URL이 빈 문자열이어야 함
      if (tab.url !== '') {
        errors.push('note 타입 탭의 url은 빈 문자열이어야 합니다');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 탭 생성 데이터 타입
 */
export interface CreateTabData {
  title: string;
  url?: string;
  collectionId: string;
  type: 'link' | 'note';
  noteContent?: string;
  description?: string;
  favicon?: string;
  tags?: string[];
  sortOrder?: number;
}

/**
 * 새로운 탭을 생성합니다
 */
export function createTab(data: CreateTabData): Tab {
  // 공통 검증 규칙을 사용한 입력 데이터 검증
  validateTabCreationData(data);

  const now = new Date();

  // 타입별 기본값 설정
  const tabData: Tab = {
    id: generateId(),
    title: data.title.trim(),
    url: data.type === 'note' ? '' : (data.url || ''),
    favicon: data.favicon,
    description: data.description,
    collectionId: data.collectionId,
    sortOrder: data.sortOrder ?? 0,
    type: data.type,
    noteContent: data.noteContent,
    tags: data.tags ? [...data.tags] : [], // 배열 복사로 불변성 보장
    createdAt: now,
    updatedAt: now,
  };

  // 생성된 탭의 최종 검증
  const validation = validateTab(tabData);
  if (!validation.isValid) {
    throw createValidationError(validation.errors[0]);
  }

  return tabData;
}

/**
 * 탭 생성 데이터의 유효성을 검증합니다
 */
function validateTabCreationData(data: CreateTabData): void {
  // 기본 필드 검증
  const titleValidation = validate(data.title, [
    required('title'),
    typeCheck('string', 'title'),
    stringLength(1, 200, 'title')
  ]);

  if (!titleValidation.isValid) {
    throw createValidationError(titleValidation.errors[0]);
  }

  const collectionIdValidation = validate(data.collectionId, [
    required('collectionId'),
    typeCheck('string', 'collectionId')
  ]);

  if (!collectionIdValidation.isValid) {
    throw createValidationError(collectionIdValidation.errors[0]);
  }

  // 타입별 특별 검증
  if (!isValidTabType(data.type)) {
    throw createValidationError('type은 link 또는 note여야 합니다');
  }

  if (data.type === 'link') {
    const url = data.url || '';
    if (!isValidTabUrl(url)) {
      throw createValidationError('올바른 URL 형식이어야 합니다');
    }
  }

  if (data.type === 'note') {
    if (!data.noteContent || typeof data.noteContent !== 'string') {
      throw createValidationError('노트 타입 탭은 noteContent가 필요합니다');
    }
    if (data.noteContent.trim().length === 0) {
      throw createValidationError('노트 내용은 최소 1자 이상이어야 합니다');
    }
  }

  // 태그 검증
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      throw createValidationError('tags는 배열이어야 합니다');
    }
    if (data.tags.some(tag => typeof tag !== 'string')) {
      throw createValidationError('모든 태그는 문자열이어야 합니다');
    }
  }
}

/**
 * 탭 URL의 유효성을 검증합니다
 */
export function isValidTabUrl(url: string, type?: 'link' | 'note'): boolean {
  // 노트 타입인 경우 빈 URL도 허용
  if (type === 'note' && url === '') {
    return true;
  }

  // 빈 문자열이나 공백만 있는 경우
  if (!url || url.trim().length === 0) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    // HTTP, HTTPS만 허용
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * 탭 제목의 유효성을 검증합니다
 */
export function isValidTabTitle(title: string): boolean {
  if (!title || typeof title !== 'string') {
    return false;
  }

  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return false;
  }

  if (trimmed.length > 200) {
    return false;
  }

  return true;
}

/**
 * 탭 타입이 유효한지 검증합니다
 */
export function isValidTabType(type: unknown): type is 'link' | 'note' {
  return type === 'link' || type === 'note';
}

/**
 * 탭의 마지막 방문 시간을 업데이트합니다
 */
export function updateTabLastVisited(tab: Tab): Tab {
  return {
    ...tab,
    lastVisited: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * 탭의 제목을 업데이트합니다
 */
export function updateTabTitle(tab: Tab, newTitle: string): Tab {
  if (!isValidTabTitle(newTitle)) {
    throw createValidationError('올바른 제목을 입력해주세요');
  }

  return {
    ...tab,
    title: newTitle.trim(),
    updatedAt: new Date(),
  };
}

/**
 * 탭의 태그를 업데이트합니다
 */
export function updateTabTags(tab: Tab, tags: string[]): Tab {
  if (!Array.isArray(tags)) {
    throw createValidationError('tags는 배열이어야 합니다');
  }

  return {
    ...tab,
    tags: [...tags],
    updatedAt: new Date(),
  };
}