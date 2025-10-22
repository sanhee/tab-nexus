import { Collection, Tab } from './index';

/**
 * 스토리지에 저장되는 메인 데이터 구조
 */
export interface StorageData {
  /** 컬렉션 목록 */
  collections: Collection[];
  /** 탭 목록 */
  tabs: Tab[];
  /** 데이터 버전 (마이그레이션에 사용) */
  version: string;
  /** 마지막 업데이트 시간 */
  lastUpdated: number;
  /** 선택적 메타데이터 */
  metadata?: {
    /** 백업 생성 시간 */
    backupCreatedAt?: number;
    /** 마이그레이션 이력 */
    migrationHistory?: string[];
    /** 사용자 설정 */
    userPreferences?: Record<string, any>;
  };
}

/**
 * 스토리지 작업 옵션
 */
export interface StorageOptions {
  /** 사용할 스토리지 타입 (기본: localStorage) */
  storage?: 'local' | 'session';
  /** 데이터 압축 여부 */
  compress?: boolean;
  /** TTL (Time To Live) - 밀리초 단위 */
  ttl?: number;
  /** 온라인 상태 필요 여부 */
  requireOnline?: boolean;
  /** 백업 생성 여부 */
  createBackup?: boolean;
  /** 백업에서 복원 여부 */
  useBackup?: boolean;
  /** 락 획득 여부 */
  acquireLock?: boolean;
  /** 락 타임아웃 (밀리초) */
  lockTimeout?: number;
  /** 만료된 데이터만 정리 여부 */
  onlyExpired?: boolean;
}

/**
 * 스토리지 작업 결과
 */
export interface StorageResult<T = any> {
  /** 작업 성공 여부 */
  success: boolean;
  /** 결과 데이터 */
  data?: T;
  /** 오류 메시지 */
  error?: string;
  /** 추가 메타데이터 */
  metadata?: {
    /** 작업 시간 (밀리초) */
    duration?: number;
    /** 압축률 (압축 사용 시) */
    compressionRatio?: number;
    /** 백업 생성 여부 */
    backupCreated?: boolean;
  };
}

/**
 * 스토리지 용량 정보
 */
export interface StorageSize {
  /** 사용 중인 용량 (바이트) */
  used: number;
  /** 사용 가능한 용량 (바이트) */
  available: number;
  /** 전체 용량 (바이트) */
  total: number;
  /** 사용률 (0-100) */
  usagePercentage: number;
}

/**
 * 스토리지 정리 결과
 */
export interface StorageCleanResult {
  /** 작업 성공 여부 */
  success: boolean;
  /** 정리된 항목 수 */
  cleaned: number;
  /** 확보된 용량 (바이트) */
  freedSpace: number;
  /** 오류 메시지 */
  error?: string;
}

/**
 * 데이터 검증 결과
 */
export interface ValidationResult {
  /** 검증 성공 여부 */
  isValid: boolean;
  /** 오류 목록 */
  errors: string[];
  /** 경고 목록 */
  warnings?: string[];
}

/**
 * 마이그레이션 결과
 */
export interface MigrationResult {
  /** 마이그레이션 성공 여부 */
  success: boolean;
  /** 마이그레이션된 데이터 */
  data: StorageData;
  /** 오류 메시지 */
  error?: string;
  /** 마이그레이션 세부 정보 */
  details?: {
    /** 원본 버전 */
    fromVersion: string;
    /** 대상 버전 */
    toVersion: string;
    /** 적용된 마이그레이션 단계 */
    steps: string[];
  };
}

/**
 * TTL 메타데이터가 포함된 스토리지 항목
 */
export interface StorageItem<T = any> {
  /** 실제 데이터 */
  data: T;
  /** 저장 시간 */
  timestamp: number;
  /** TTL (밀리초, 선택적) */
  ttl?: number;
  /** 압축 여부 */
  compressed?: boolean;
}

/**
 * 스토리지 이벤트 타입
 */
export type StorageEventType =
  | 'save'
  | 'load'
  | 'remove'
  | 'clear'
  | 'migration'
  | 'error'
  | 'quota-exceeded';

/**
 * 스토리지 이벤트 데이터
 */
export interface StorageEvent {
  /** 이벤트 타입 */
  type: StorageEventType;
  /** 이벤트 시간 */
  timestamp: number;
  /** 관련된 키 */
  key?: string;
  /** 이벤트 데이터 */
  data?: any;
  /** 오류 정보 (에러 이벤트인 경우) */
  error?: string;
}

/**
 * 커스텀 스토리지 에러 클래스
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * 스토리지 용량 부족 에러 클래스
 */
export class StorageQuotaError extends StorageError {
  constructor(
    message: string,
    public required: number,
    public available: number
  ) {
    super(message, 'QUOTA_EXCEEDED', { required, available });
    this.name = 'StorageQuotaError';
  }
}

/**
 * 스토리지 마이그레이션 에러 클래스
 */
export class StorageMigrationError extends StorageError {
  constructor(
    message: string,
    public fromVersion: string,
    public toVersion: string
  ) {
    super(message, 'MIGRATION_FAILED', { fromVersion, toVersion });
    this.name = 'StorageMigrationError';
  }
}

/**
 * 스토리지 락 에러 클래스
 */
export class StorageLockError extends StorageError {
  constructor(message: string, public key: string, public timeout: number) {
    super(message, 'LOCK_TIMEOUT', { key, timeout });
    this.name = 'StorageLockError';
  }
}