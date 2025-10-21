/**
 * 탭 검증 유틸리티
 * 탭 관련 입력값 검증 로직을 중앙화
 */

/**
 * 탭 검증 에러 타입
 */
export class TabValidationError extends Error {
  readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'TabValidationError'
    this.code = code
  }
}

/**
 * 에러 코드 상수
 */
export const TAB_ERROR_CODES = {
  INVALID_TYPE: 'INVALID_TYPE',
  REQUIRED: 'REQUIRED',
  TOO_LONG: 'TOO_LONG',
  INVALID_URL: 'INVALID_URL',
  INVALID_URL_FORMAT: 'INVALID_URL_FORMAT',
  INVALID_COLLECTION_ID: 'INVALID_COLLECTION_ID',
  NOT_FOUND: 'NOT_FOUND'
} as const

/**
 * 탭 제목 검증
 */
export function validateTabTitle(title: string): void {
  if (typeof title !== 'string') {
    throw new TabValidationError('제목은 문자열이어야 합니다', TAB_ERROR_CODES.INVALID_TYPE)
  }

  const trimmedTitle = title.trim()
  if (!trimmedTitle) {
    throw new TabValidationError('탭 제목은 필수입니다', TAB_ERROR_CODES.REQUIRED)
  }

  if (trimmedTitle.length > 200) {
    throw new TabValidationError('탭 제목은 200자 이하여야 합니다', TAB_ERROR_CODES.TOO_LONG)
  }
}

/**
 * URL 검증
 */
export function validateUrl(url: string): void {
  if (typeof url !== 'string' || !url.trim()) {
    throw new TabValidationError('유효한 URL이 필요합니다', TAB_ERROR_CODES.INVALID_URL)
  }

  try {
    new URL(url)
  } catch {
    throw new TabValidationError('올바른 URL 형식이 아닙니다', TAB_ERROR_CODES.INVALID_URL_FORMAT)
  }
}

/**
 * 컬렉션 ID 검증
 */
export function validateCollectionId(collectionId: string): void {
  if (typeof collectionId !== 'string' || !collectionId.trim()) {
    throw new TabValidationError('유효한 컬렉션 ID가 필요합니다', TAB_ERROR_CODES.INVALID_COLLECTION_ID)
  }
}

/**
 * 탭 입력 전체 검증
 */
export function validateTabInput(input: {
  title: string
  url: string
  collectionId: string
}): void {
  validateTabTitle(input.title)
  validateUrl(input.url)
  validateCollectionId(input.collectionId)
}