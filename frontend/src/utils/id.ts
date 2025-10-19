/**
 * 고유한 ID를 생성합니다
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);

  return prefix ? `${prefix}-${timestamp}-${randomPart}` : `${timestamp}-${randomPart}`;
}

/**
 * ID가 유효한 형식인지 검증합니다
 */
export function isValidId(id: string, prefix?: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  if (prefix) {
    return id.startsWith(`${prefix}-`);
  }

  // 일반적인 ID 형식 검증 (타임스탬프-랜덤문자열)
  const idPattern = /^[a-z0-9]+-[a-z0-9]+(-[a-z0-9]+)?$/;
  return idPattern.test(id);
}