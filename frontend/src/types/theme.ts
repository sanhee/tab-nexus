/**
 * 테마 시스템 타입 정의
 * - 라이트/다크 모드 지원
 * - CSS 변수 기반 테마 시스템
 * - 반응형 디자인 지원
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  success: string;
  warning: string;
  error: string;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
}

export interface ThemeTypography {
  fontFamily: {
    primary: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
}

export interface CSSVariableMap {
  [key: string]: string;
}

export interface ResponsiveBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface CSSProperties {
  [property: string]: string;
}

export type CSSValueType = 'color' | 'size' | 'font' | 'spacing' | 'any';

export interface ParsedCSS {
  [selector: string]: CSSProperties;
}

export type ClassNameValue = string | number | boolean | undefined | null;
export type ClassNameObject = Record<string, boolean>;
export type ClassNameInput = ClassNameValue | ClassNameObject;

/**
 * 테마 컨텍스트 타입
 */
export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: Theme) => void;
}

/**
 * 로컬 스토리지 테마 설정 타입
 */
export interface ThemeStorageConfig {
  key: string;
  defaultMode: ThemeMode;
  systemPreference: boolean;
}