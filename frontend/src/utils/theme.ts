import type { Theme, ThemeMode, ThemeColors } from '@/types/theme';
import type { ValidationResult } from './validation';

/**
 * 라이트 테마 색상 팔레트
 */
const LIGHT_COLORS: ThemeColors = {
  primary: '#007acc',
  secondary: '#6c757d',
  tertiary: '#28a745',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#e9ecef'
  },
  text: {
    primary: '#212529',
    secondary: '#6c757d',
    tertiary: '#adb5bd'
  },
  border: {
    primary: '#dee2e6',
    secondary: '#e9ecef',
    focus: '#007acc'
  }
};

/**
 * 다크 테마 색상 팔레트
 */
const DARK_COLORS: ThemeColors = {
  primary: '#007acc',
  secondary: '#6c757d',
  tertiary: '#28a745',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  background: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    tertiary: '#404040'
  },
  text: {
    primary: '#ffffff',
    secondary: '#b3b3b3',
    tertiary: '#808080'
  },
  border: {
    primary: '#404040',
    secondary: '#2d2d2d',
    focus: '#007acc'
  }
};

/**
 * 기본 테마 설정
 */
const BASE_THEME = {
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      mono: 'Menlo, Monaco, Consolas, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  }
};

/**
 * 테마 모드 검증
 */
export function isValidThemeMode(mode: unknown): mode is ThemeMode {
  return mode === 'light' || mode === 'dark';
}

/**
 * 테마 객체 검증
 */
export function validateTheme(theme: unknown): ValidationResult {
  if (!theme || typeof theme !== 'object') {
    return {
      isValid: false,
      errors: ['테마 객체가 유효하지 않습니다']
    };
  }

  const t = theme as any;
  const errors: string[] = [];

  // 필수 필드 검증
  if (!t.mode) {
    errors.push('mode 필드는 필수입니다');
  } else if (!isValidThemeMode(t.mode)) {
    errors.push('mode는 light 또는 dark여야 합니다');
  }

  if (!t.colors) {
    errors.push('colors 필드는 필수입니다');
  }

  if (!t.typography) {
    errors.push('typography 필드는 필수입니다');
  }

  if (!t.spacing) {
    errors.push('spacing 필드는 필수입니다');
  }

  if (!t.borderRadius) {
    errors.push('borderRadius 필드는 필수입니다');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 테마 생성
 */
export function createTheme(mode: ThemeMode): Theme {
  if (!isValidThemeMode(mode)) {
    throw new Error('유효하지 않은 테마 모드입니다');
  }

  return {
    mode,
    colors: mode === 'light' ? LIGHT_COLORS : DARK_COLORS,
    ...BASE_THEME
  };
}

/**
 * 테마에서 색상 정보 추출
 */
export function getThemeColors(theme: Theme): ThemeColors {
  return theme.colors;
}

/**
 * 테마 전환
 */
export function switchTheme(currentTheme: Theme, newMode: ThemeMode): Theme {
  if (currentTheme.mode === newMode) {
    return currentTheme;
  }

  return createTheme(newMode);
}

/**
 * 기본 테마 반환
 */
export function getDefaultTheme(): Theme {
  return createTheme('light');
}