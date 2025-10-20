import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  applyCSSVariables,
  removeCSSVariables,
  generateCSSVariables,
  parseCSS,
  validateCSSValue,
  convertRemToPx,
  convertPxToRem,
  generateResponsiveBreakpoints,
  createCSSRule,
  combineClassNames
} from '@/utils/css';
import type { Theme, CSSVariableMap, ResponsiveBreakpoints } from '@types/theme';

describe('CSS 유틸리티', () => {
  let mockDocument: Document;

  beforeEach(() => {
    // DOM 환경 초기화
    document.documentElement.style.cssText = '';
  });

  afterEach(() => {
    // 테스트 후 정리
    document.documentElement.style.cssText = '';
  });

  describe('CSS 변수 생성', () => {
    test('테마 객체에서 CSS 변수를 생성할 수 있어야 한다', () => {
      const theme: Partial<Theme> = {
        colors: {
          primary: '#007acc',
          background: {
            primary: '#ffffff',
            secondary: '#f8f9fa'
          }
        }
      };

      const cssVariables = generateCSSVariables(theme);

      expect(cssVariables).toHaveProperty('--color-primary', '#007acc');
      expect(cssVariables).toHaveProperty('--color-background-primary', '#ffffff');
      expect(cssVariables).toHaveProperty('--color-background-secondary', '#f8f9fa');
    });

    test('중첩된 객체를 올바른 CSS 변수명으로 변환해야 한다', () => {
      const theme: Partial<Theme> = {
        typography: {
          fontSize: {
            base: '1rem',
            lg: '1.125rem'
          },
          fontWeight: {
            normal: '400',
            bold: '700'
          }
        }
      };

      const cssVariables = generateCSSVariables(theme);

      expect(cssVariables).toHaveProperty('--typography-font-size-base', '1rem');
      expect(cssVariables).toHaveProperty('--typography-font-size-lg', '1.125rem');
      expect(cssVariables).toHaveProperty('--typography-font-weight-normal', '400');
      expect(cssVariables).toHaveProperty('--typography-font-weight-bold', '700');
    });

    test('빈 객체에 대해 빈 CSS 변수 맵을 반환해야 한다', () => {
      const cssVariables = generateCSSVariables({});

      expect(Object.keys(cssVariables)).toHaveLength(0);
    });
  });

  describe('CSS 변수 적용', () => {
    test('CSS 변수를 문서 루트에 적용할 수 있어야 한다', () => {
      const cssVariables: CSSVariableMap = {
        '--color-primary': '#007acc',
        '--spacing-md': '1rem'
      };

      applyCSSVariables(cssVariables);

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#007acc');
      expect(document.documentElement.style.getPropertyValue('--spacing-md')).toBe('1rem');
    });

    test('특정 요소에 CSS 변수를 적용할 수 있어야 한다', () => {
      const element = document.createElement('div');
      const cssVariables: CSSVariableMap = {
        '--color-background': '#ffffff'
      };

      applyCSSVariables(cssVariables, element);

      expect(element.style.getPropertyValue('--color-background')).toBe('#ffffff');
    });
  });

  describe('CSS 변수 제거', () => {
    test('문서 루트에서 CSS 변수를 제거할 수 있어야 한다', () => {
      // 변수 먼저 적용
      document.documentElement.style.setProperty('--test-var', 'value');
      expect(document.documentElement.style.getPropertyValue('--test-var')).toBe('value');

      // 변수 제거
      removeCSSVariables(['--test-var']);
      expect(document.documentElement.style.getPropertyValue('--test-var')).toBe('');
    });

    test('특정 요소에서 CSS 변수를 제거할 수 있어야 한다', () => {
      const element = document.createElement('div');
      element.style.setProperty('--test-var', 'value');

      removeCSSVariables(['--test-var'], element);
      expect(element.style.getPropertyValue('--test-var')).toBe('');
    });
  });

  describe('CSS 값 검증', () => {
    test('유효한 색상 값을 검증할 수 있어야 한다', () => {
      expect(validateCSSValue('#ffffff', 'color')).toBe(true);
      expect(validateCSSValue('#fff', 'color')).toBe(true);
      expect(validateCSSValue('rgb(255, 255, 255)', 'color')).toBe(true);
      expect(validateCSSValue('rgba(255, 255, 255, 0.5)', 'color')).toBe(true);
      expect(validateCSSValue('hsl(0, 0%, 100%)', 'color')).toBe(true);
      expect(validateCSSValue('transparent', 'color')).toBe(true);
    });

    test('유효하지 않은 색상 값을 거부해야 한다', () => {
      expect(validateCSSValue('not-a-color', 'color')).toBe(false);
      expect(validateCSSValue('#gggggg', 'color')).toBe(false);
      expect(validateCSSValue('rgb(256, 256, 256)', 'color')).toBe(false);
    });

    test('유효한 크기 값을 검증할 수 있어야 한다', () => {
      expect(validateCSSValue('1rem', 'size')).toBe(true);
      expect(validateCSSValue('16px', 'size')).toBe(true);
      expect(validateCSSValue('100%', 'size')).toBe(true);
      expect(validateCSSValue('0', 'size')).toBe(true);
      expect(validateCSSValue('calc(100% - 2rem)', 'size')).toBe(true);
    });

    test('유효하지 않은 크기 값을 거부해야 한다', () => {
      expect(validateCSSValue('invalid-size', 'size')).toBe(false);
      expect(validateCSSValue('-1rem', 'size')).toBe(false);
      expect(validateCSSValue('1.5.5rem', 'size')).toBe(false);
    });
  });

  describe('단위 변환', () => {
    test('rem을 px로 변환할 수 있어야 한다', () => {
      expect(convertRemToPx('1rem')).toBe('16px');
      expect(convertRemToPx('2rem')).toBe('32px');
      expect(convertRemToPx('0.5rem')).toBe('8px');
    });

    test('px을 rem으로 변환할 수 있어야 한다', () => {
      expect(convertPxToRem('16px')).toBe('1rem');
      expect(convertPxToRem('32px')).toBe('2rem');
      expect(convertPxToRem('8px')).toBe('0.5rem');
    });

    test('숫자가 아닌 값에 대해 원래 값을 반환해야 한다', () => {
      expect(convertRemToPx('auto')).toBe('auto');
      expect(convertPxToRem('100%')).toBe('100%');
    });
  });

  describe('반응형 브레이크포인트', () => {
    test('브레이크포인트를 생성할 수 있어야 한다', () => {
      const breakpoints: ResponsiveBreakpoints = {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      };

      const cssRules = generateResponsiveBreakpoints(breakpoints);

      expect(cssRules).toContain('@media (min-width: 640px)');
      expect(cssRules).toContain('@media (min-width: 768px)');
      expect(cssRules).toContain('@media (min-width: 1024px)');
      expect(cssRules).toContain('@media (min-width: 1280px)');
    });
  });

  describe('CSS 규칙 생성', () => {
    test('CSS 규칙을 생성할 수 있어야 한다', () => {
      const selector = '.button';
      const properties = {
        'background-color': 'var(--color-primary)',
        'padding': 'var(--spacing-md)',
        'border-radius': 'var(--border-radius-md)'
      };

      const cssRule = createCSSRule(selector, properties);

      expect(cssRule).toContain('.button {');
      expect(cssRule).toContain('background-color: var(--color-primary);');
      expect(cssRule).toContain('padding: var(--spacing-md);');
      expect(cssRule).toContain('border-radius: var(--border-radius-md);');
      expect(cssRule).toContain('}');
    });
  });

  describe('클래스명 결합', () => {
    test('여러 클래스명을 결합할 수 있어야 한다', () => {
      const className = combineClassNames('btn', 'btn-primary', 'btn-large');
      expect(className).toBe('btn btn-primary btn-large');
    });

    test('조건부 클래스명을 처리할 수 있어야 한다', () => {
      const className = combineClassNames(
        'btn',
        { 'btn-disabled': true, 'btn-loading': false },
        'btn-primary'
      );
      expect(className).toBe('btn btn-disabled btn-primary');
    });

    test('빈 값과 undefined를 필터링해야 한다', () => {
      const className = combineClassNames(
        'btn',
        '',
        null,
        undefined,
        'btn-primary'
      );
      expect(className).toBe('btn btn-primary');
    });

    test('중복된 클래스명을 제거해야 한다', () => {
      const className = combineClassNames('btn', 'btn-primary', 'btn', 'btn-primary');
      expect(className).toBe('btn btn-primary');
    });
  });

  describe('CSS 파싱', () => {
    test('CSS 문자열을 파싱할 수 있어야 한다', () => {
      const css = `
        .button {
          background-color: #007acc;
          padding: 1rem;
        }
        .text {
          color: #333;
        }
      `;

      const parsed = parseCSS(css);

      expect(parsed).toHaveProperty('.button');
      expect(parsed['.button']).toHaveProperty('background-color', '#007acc');
      expect(parsed['.button']).toHaveProperty('padding', '1rem');
      expect(parsed['.text']).toHaveProperty('color', '#333');
    });

    test('잘못된 CSS에 대해 빈 객체를 반환해야 한다', () => {
      const invalidCSS = 'not valid css';
      const parsed = parseCSS(invalidCSS);

      expect(Object.keys(parsed)).toHaveLength(0);
    });
  });
});