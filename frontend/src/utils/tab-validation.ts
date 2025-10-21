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
  DUPLICATE_URL: 'DUPLICATE_URL',
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
export function validateUrl(url: string, tabType: 'link' | 'note' = 'link'): void {
  if (typeof url !== 'string') {
    throw new TabValidationError('URL은 문자열이어야 합니다', TAB_ERROR_CODES.INVALID_TYPE)
  }

  // 노트 타입은 빈 URL 허용
  if (tabType === 'note' && url.trim() === '') {
    return
  }

  // 링크 타입은 URL 필수
  if (!url.trim()) {
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
  type?: 'link' | 'note'
}): void {
  validateTabTitle(input.title)
  validateUrl(input.url, input.type || 'link')
  validateCollectionId(input.collectionId)
}

/**
 * 중복 URL 검증 옵션
 */
interface DuplicateUrlOptions {
  skipNoteType?: boolean
  skipEmptyUrl?: boolean
}

/**
 * 중복 URL 검증
 */
export function validateDuplicateUrl(
  url: string,
  collectionId: string,
  existingTabs: Array<{ url: string; collectionId: string; type: 'link' | 'note' }>,
  options: DuplicateUrlOptions = { skipNoteType: true, skipEmptyUrl: true }
): void {
  // 빈 URL은 중복 검사하지 않음
  if (options.skipEmptyUrl && !url.trim()) {
    return
  }

  // 성능 최적화: Set을 사용하여 O(1) 조회
  const urlSet = new Set<string>()

  for (const tab of existingTabs) {
    if (tab.collectionId === collectionId) {
      // 노트 타입 건너뛰기 옵션
      if (options.skipNoteType && tab.type === 'note') {
        continue
      }

      urlSet.add(tab.url)
    }
  }

  if (urlSet.has(url)) {
    throw new TabValidationError(
      '같은 컬렉션에 동일한 URL이 이미 존재합니다',
      TAB_ERROR_CODES.DUPLICATE_URL
    )
  }
}

/**
 * 탭 타입별 검증 규칙
 */
const TAB_TYPE_RULES = {
  link: {
    urlRequired: true,
    allowEmptyUrl: false,
    checkDuplicate: true
  },
  note: {
    urlRequired: false,
    allowEmptyUrl: true,
    checkDuplicate: false
  }
} as const

/**
 * 탭 타입별 검증
 */
export function validateByTabType(
  input: { url: string; type?: 'link' | 'note' },
  collectionId: string,
  existingTabs: Array<{ url: string; collectionId: string; type: 'link' | 'note' }> = []
): void {
  const tabType = input.type || 'link'
  const rules = TAB_TYPE_RULES[tabType]

  // URL 검증
  validateUrl(input.url, tabType)

  // 중복 검사 (타입별 규칙 적용)
  if (rules.checkDuplicate) {
    validateDuplicateUrl(input.url, collectionId, existingTabs, {
      skipNoteType: true,
      skipEmptyUrl: !rules.urlRequired
    })
  }
}