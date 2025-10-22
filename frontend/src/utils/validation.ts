/**
 * 공통 검증 결과 타입
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 검증 규칙 타입
 */
export type ValidationRule<T> = (value: T) => string | null;

/**
 * 여러 검증 규칙을 실행하고 결과를 반환합니다
 */
export function validate<T>(value: T, rules: ValidationRule<T>[]): ValidationResult {
  const errors: string[] = [];

  for (const rule of rules) {
    const error = rule(value);
    if (error) {
      errors.push(error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 필수 필드 검증 규칙
 */
export function required<T>(fieldName: string): ValidationRule<T> {
  return (value: T) => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName}은 필수 항목입니다`;
    }
    return null;
  };
}

/**
 * 타입 검증 규칙
 */
export function typeCheck<T>(
  expectedType: 'string' | 'number' | 'boolean' | 'object',
  fieldName: string,
): ValidationRule<T> {
  return (value: T) => {
    if (typeof value !== expectedType) {
      return `${fieldName}는 ${expectedType}이어야 합니다`;
    }
    return null;
  };
}

/**
 * 타임스탬프 (숫자) 검증 규칙
 */
export function dateCheck<T>(fieldName: string): ValidationRule<T> {
  return (value: T) => {
    if (typeof value !== 'number' || isNaN(value as number) || (value as number) <= 0) {
      return `${fieldName}는 유효한 타임스탬프여야 합니다`;
    }
    return null;
  };
}

/**
 * 문자열 길이 검증 규칙
 */
export function stringLength(min: number, max: number, fieldName: string): ValidationRule<string> {
  return (value: string) => {
    if (typeof value !== 'string') {
      return null; // 타입 검증은 typeCheck에서 처리
    }

    const trimmed = value.trim();
    if (trimmed.length < min) {
      return `${fieldName}은 최소 ${min}자 이상이어야 합니다`;
    }
    if (trimmed.length > max) {
      return `${fieldName}은 최대 ${max}자까지 입력할 수 있습니다`;
    }
    return null;
  };
}

/**
 * 검증 오류 객체를 생성합니다
 */
export function createValidationError(message: string): Error {
  const error = new Error(message);
  error.name = 'ValidationError';
  return error;
}