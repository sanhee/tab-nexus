/**
 * 자동 저장 미들웨어 설정 옵션
 */
export interface AutoSaveOptions<T = any> {
  /** 스토리지 키 */
  key: string;

  /** 저장 함수 */
  onSave: (state: T) => void | Promise<void>;

  /** Debounce 시간 (밀리초) */
  debounceMs?: number;

  /** 최대 재시도 횟수 */
  maxRetries?: number;

  /** 재시도 간격 (밀리초) */
  retryDelay?: number;

  /** 저장 여부 조건 함수 */
  shouldSave?: (state: T) => boolean;

  /** Deep comparison 활성화 여부 */
  enableDeepCompare?: boolean;

  /** 저장 시작 콜백 */
  onSaveStart?: (state: T) => void;

  /** 저장 성공 콜백 */
  onSaveSuccess?: (state: T) => void;

  /** 에러 콜백 */
  onError?: (error: Error, state: T) => void;
}

/**
 * 자동 저장 상태
 */
export interface AutoSaveState {
  /** 저장 중 여부 */
  isSaving: boolean;

  /** 마지막 저장 시간 */
  lastSaveTime: number | null;

  /** 마지막 에러 */
  lastError: Error | null;

  /** 재시도 횟수 */
  retryCount: number;
}
