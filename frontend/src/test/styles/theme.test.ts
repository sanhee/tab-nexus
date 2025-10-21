import { describe, test, expect, beforeEach } from 'vitest';
import type { Theme, ThemeMode } from '@/types/theme';
import {
  createTheme,
  validateTheme,
  getThemeColors,
  isValidThemeMode,
  switchTheme,
  getDefaultTheme
} from '@/utils/theme';

describe('테마 시스템', () => {
  describe('테마 타입 검증', () => {
    test('유효한 테마 객체를 검증할 수 있어야 한다', () => {
      const validTheme: Theme = {
        mode: 'light',
        colors: {
          primary: '#007acc',
          secondary: '#6c757d',
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
        },
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

      const result = validateTheme(validTheme);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('필수 필드가 누락된 테마는 유효하지 않아야 한다', () => {
      const invalidTheme = {
        mode: 'light',
        // colors 필드 누락
        typography: {},
        spacing: {},
        borderRadius: {}
      } as unknown as Theme;

      const result = validateTheme(invalidTheme);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('colors 필드는 필수입니다');
    });

    test('잘못된 테마 모드는 유효하지 않아야 한다', () => {
      const invalidTheme = {
        mode: 'invalid' as ThemeMode,
        colors: {},
        typography: {},
        spacing: {},
        borderRadius: {}
      } as Theme;

      const result = validateTheme(invalidTheme);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('mode는 light 또는 dark여야 합니다');
    });
  });

  describe('테마 모드 검증', () => {
    test('유효한 테마 모드를 검증할 수 있어야 한다', () => {
      expect(isValidThemeMode('light')).toBe(true);
      expect(isValidThemeMode('dark')).toBe(true);
    });

    test('유효하지 않은 테마 모드를 거부해야 한다', () => {
      expect(isValidThemeMode('auto')).toBe(false);
      expect(isValidThemeMode('system')).toBe(false);
      expect(isValidThemeMode('')).toBe(false);
      expect(isValidThemeMode(null as any)).toBe(false);
      expect(isValidThemeMode(undefined as any)).toBe(false);
    });
  });

  describe('테마 생성', () => {
    test('라이트 테마를 생성할 수 있어야 한다', () => {
      const lightTheme = createTheme('light');

      expect(lightTheme.mode).toBe('light');
      expect(lightTheme.colors.background.primary).toBe('#ffffff');
      expect(lightTheme.colors.text.primary).toBe('#212529');
    });

    test('다크 테마를 생성할 수 있어야 한다', () => {
      const darkTheme = createTheme('dark');

      expect(darkTheme.mode).toBe('dark');
      expect(darkTheme.colors.background.primary).toBe('#1a1a1a');
      expect(darkTheme.colors.text.primary).toBe('#ffffff');
    });

    test('잘못된 모드로는 테마를 생성할 수 없어야 한다', () => {
      expect(() => createTheme('invalid' as ThemeMode)).toThrow('유효하지 않은 테마 모드입니다');
    });
  });

  describe('테마 색상 추출', () => {
    test('테마에서 색상을 추출할 수 있어야 한다', () => {
      const theme = createTheme('light');
      const colors = getThemeColors(theme);

      expect(colors.primary).toBe('#007acc');
      expect(colors.background.primary).toBe('#ffffff');
      expect(colors.text.primary).toBe('#212529');
    });

    test('다크 테마에서 다른 색상을 추출해야 한다', () => {
      const theme = createTheme('dark');
      const colors = getThemeColors(theme);

      expect(colors.background.primary).toBe('#1a1a1a');
      expect(colors.text.primary).toBe('#ffffff');
    });
  });

  describe('테마 전환', () => {
    let currentTheme: Theme;

    beforeEach(() => {
      currentTheme = createTheme('light');
    });

    test('라이트에서 다크로 전환할 수 있어야 한다', () => {
      const newTheme = switchTheme(currentTheme, 'dark');

      expect(newTheme.mode).toBe('dark');
      expect(newTheme.colors.background.primary).toBe('#1a1a1a');
    });

    test('다크에서 라이트로 전환할 수 있어야 한다', () => {
      const darkTheme = createTheme('dark');
      const newTheme = switchTheme(darkTheme, 'light');

      expect(newTheme.mode).toBe('light');
      expect(newTheme.colors.background.primary).toBe('#ffffff');
    });

    test('같은 모드로 전환해도 동일한 테마를 반환해야 한다', () => {
      const newTheme = switchTheme(currentTheme, 'light');

      expect(newTheme.mode).toBe('light');
      expect(newTheme).toEqual(currentTheme);
    });
  });

  describe('기본 테마', () => {
    test('기본 테마를 가져올 수 있어야 한다', () => {
      const defaultTheme = getDefaultTheme();

      expect(defaultTheme.mode).toBe('light');
      expect(validateTheme(defaultTheme).isValid).toBe(true);
    });

    test('기본 테마는 모든 필수 필드를 포함해야 한다', () => {
      const defaultTheme = getDefaultTheme();

      expect(defaultTheme.colors).toBeDefined();
      expect(defaultTheme.typography).toBeDefined();
      expect(defaultTheme.spacing).toBeDefined();
      expect(defaultTheme.borderRadius).toBeDefined();
    });
  });

  describe('테마 시스템 성능', () => {
    test('1000번의 테마 생성이 빠르게 처리되어야 한다', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        createTheme(i % 2 === 0 ? 'light' : 'dark');
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // 100ms 이내
    });

    test('테마 전환 성능이 적절해야 한다', () => {
      const theme = createTheme('light');
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        switchTheme(theme, i % 2 === 0 ? 'dark' : 'light');
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(50); // 50ms 이내
    });
  });
});