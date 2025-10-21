/**
 * ID 생성 유틸리티
 * UUID 및 고유 식별자 생성을 위한 헬퍼 함수들
 */

/**
 * UUID v4 생성 (crypto API 사용)
 *
 * @returns 고유한 UUID 문자열
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback for older environments
  return generateFallbackId()
}

/**
 * 탭용 ID 생성 (접두사 포함)
 *
 * @param prefix ID 접두사 (기본값: 'tab')
 * @returns tab- 접두사가 포함된 고유 ID
 */
export function generateTabId(prefix: string = 'tab'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${generateFallbackId()}`
}

/**
 * 컬렉션용 ID 생성 (접두사 포함)
 *
 * @param prefix ID 접두사 (기본값: 'col')
 * @returns col- 접두사가 포함된 고유 ID
 */
export function generateCollectionId(prefix: string = 'col'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${generateFallbackId()}`
}

/**
 * Fallback ID 생성 (crypto API가 없는 환경용)
 * Math.random()과 타임스탬프를 조합하여 고유성 보장
 *
 * @returns 랜덤 문자열 ID
 */
function generateFallbackId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomPart}`
}

/**
 * 짧은 ID 생성 (8자리)
 * 임시 ID나 간단한 식별자용
 *
 * @returns 8자리 랜덤 문자열
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10)
}

/**
 * ID 유효성 검증
 *
 * @param id 검증할 ID
 * @returns ID가 유효한지 여부
 */
export function isValidId(id: string): boolean {
  if (typeof id !== 'string' || id.length === 0) {
    return false
  }

  // UUID v4 패턴 확인
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (uuidPattern.test(id)) {
    return true
  }

  // 접두사가 있는 ID 패턴 확인 (tab-uuid, col-uuid 등)
  const prefixedUuidPattern = /^[a-z]+-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (prefixedUuidPattern.test(id)) {
    return true
  }

  // Fallback ID 패턴 확인
  const fallbackPattern = /^[a-z0-9]+-[a-z0-9]+$/i
  return fallbackPattern.test(id)
}

/**
 * ID에서 접두사 추출
 *
 * @param id 접두사를 추출할 ID
 * @returns 접두사 또는 null
 */
export function extractPrefix(id: string): string | null {
  const match = id.match(/^([a-z]+)-/)
  return match ? match[1] : null
}