import type { Collection } from '../types/index.js';
import type { ValidationResult } from './validation.js';
import { generateId } from './id.js';
import {
  validate,
  required,
  typeCheck,
  dateCheck,
  stringLength,
} from './validation.js';

// 상수 정의
export const COLLECTION_TITLE_MAX_LENGTH = 100;

/**
 * 컬렉션 객체의 유효성을 검증합니다
 */
export function validateCollection(collection: Collection): ValidationResult {
  const errors: string[] = [];

  // ID 검증
  const idValidation = validate(collection.id, [
    required('id'),
    typeCheck('string', 'id'),
  ]);
  errors.push(...idValidation.errors);

  // Title 검증
  const titleValidation = validate(collection.title, [
    required('title'),
    typeCheck('string', 'title'),
    stringLength(1, COLLECTION_TITLE_MAX_LENGTH, 'title'),
  ]);
  errors.push(...titleValidation.errors);

  // isExpanded 검증
  const expandedValidation = validate(collection.isExpanded, [
    typeCheck('boolean', 'isExpanded'),
  ]);
  errors.push(...expandedValidation.errors);

  // sortOrder 검증
  const sortOrderValidation = validate(collection.sortOrder, [
    typeCheck('number', 'sortOrder'),
  ]);
  errors.push(...sortOrderValidation.errors);

  // Date 필드 검증
  const createdAtValidation = validate(collection.createdAt, [dateCheck('createdAt')]);
  errors.push(...createdAtValidation.errors);

  const updatedAtValidation = validate(collection.updatedAt, [dateCheck('updatedAt')]);
  errors.push(...updatedAtValidation.errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 새로운 컬렉션을 생성합니다
 */
export function createCollection(title: string, sortOrder = 0): Collection {
  // 제목 유효성 검증
  const titleValidation = validate(title, [
    required('title'),
    typeCheck('string', 'title'),
    stringLength(1, COLLECTION_TITLE_MAX_LENGTH, 'title'),
  ]);

  if (!titleValidation.isValid) {
    throw new Error(titleValidation.errors[0]);
  }

  const now = new Date();

  return {
    id: generateId('col'),
    title: title.trim(),
    isExpanded: false,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 컬렉션 제목이 유효한지 검증합니다
 */
export function isValidCollectionTitle(title: string): boolean {
  const validation = validate(title, [
    required('title'),
    typeCheck('string', 'title'),
    stringLength(1, COLLECTION_TITLE_MAX_LENGTH, 'title'),
  ]);

  return validation.isValid;
}