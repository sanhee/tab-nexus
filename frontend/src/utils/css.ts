import type {
  CSSVariableMap,
  ResponsiveBreakpoints,
  CSSProperties,
  CSSValueType,
  ParsedCSS,
  ClassNameInput,
  Theme
} from '@types/theme';

/**
 * 테마 객체에서 CSS 변수 생성
 */
export function generateCSSVariables(theme: Partial<Theme>): CSSVariableMap {
  const cssVars: CSSVariableMap = {};

  function flattenObject(obj: any, prefix = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenObject(value, `${prefix}${key}-`);
      } else {
        const cssVarName = `--${prefix}${key}`.replace(/_/g, '-').replace(/([A-Z])/g, '-$1').toLowerCase();
        cssVars[cssVarName] = String(value);
      }
    }
  }

  if (theme.colors) {
    flattenObject(theme.colors, 'color-');
  }

  if (theme.typography) {
    flattenObject(theme.typography, 'typography-');
  }

  if (theme.spacing) {
    flattenObject(theme.spacing, 'spacing-');
  }

  if (theme.borderRadius) {
    flattenObject(theme.borderRadius, 'border-radius-');
  }

  return cssVars;
}

/**
 * CSS 변수를 DOM 요소에 적용
 */
export function applyCSSVariables(
  variables: CSSVariableMap,
  element: HTMLElement = document.documentElement
): void {
  for (const [property, value] of Object.entries(variables)) {
    element.style.setProperty(property, value);
  }
}

/**
 * CSS 변수를 DOM 요소에서 제거
 */
export function removeCSSVariables(
  variableNames: string[],
  element: HTMLElement = document.documentElement
): void {
  for (const variableName of variableNames) {
    element.style.removeProperty(variableName);
  }
}

/**
 * CSS 값 유효성 검증
 */
export function validateCSSValue(value: string, type: CSSValueType): boolean {
  switch (type) {
    case 'color':
      return validateColorValue(value);
    case 'size':
      return validateSizeValue(value);
    case 'font':
      return validateFontValue(value);
    case 'spacing':
      return validateSizeValue(value); // spacing은 size와 동일한 규칙
    case 'any':
      return true;
    default:
      return false;
  }
}

/**
 * 색상 값 검증
 */
function validateColorValue(value: string): boolean {
  // 기본 색상 키워드
  const colorKeywords = ['transparent', 'inherit', 'initial', 'unset', 'currentColor'];
  if (colorKeywords.includes(value)) {
    return true;
  }

  // HEX 색상
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
    return true;
  }

  // RGB/RGBA
  if (/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*(0|0?\.\d+|1))?\s*\)$/.test(value)) {
    const match = value.match(/(\d+)/g);
    if (match) {
      const [r, g, b] = match.map(Number);
      return r <= 255 && g <= 255 && b <= 255;
    }
  }

  // HSL/HSLA
  if (/^hsla?\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*(,\s*(0|0?\.\d+|1))?\s*\)$/.test(value)) {
    return true;
  }

  return false;
}

/**
 * 크기 값 검증
 */
function validateSizeValue(value: string): boolean {
  // 숫자 0
  if (value === '0') {
    return true;
  }

  // CSS 단위가 있는 값
  if (/^(\d*\.?\d+)(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)$/.test(value)) {
    const match = value.match(/^(\d*\.?\d+)/);
    if (match) {
      const num = parseFloat(match[1]);
      return num >= 0; // 음수 크기는 유효하지 않음
    }
  }

  // calc() 함수
  if (/^calc\(.+\)$/.test(value)) {
    return true;
  }

  // CSS 키워드
  const sizeKeywords = ['auto', 'inherit', 'initial', 'unset', 'max-content', 'min-content', 'fit-content'];
  if (sizeKeywords.includes(value)) {
    return true;
  }

  return false;
}

/**
 * 폰트 값 검증
 */
function validateFontValue(value: string): boolean {
  // 기본적으로 문자열이면 유효하다고 가정
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * rem을 px로 변환 (기본 16px 기준)
 */
export function convertRemToPx(remValue: string, baseFontSize = 16): string {
  const match = remValue.match(/^(\d*\.?\d+)rem$/);
  if (match) {
    const rem = parseFloat(match[1]);
    return `${rem * baseFontSize}px`;
  }
  return remValue; // rem이 아니면 원래 값 반환
}

/**
 * px을 rem으로 변환 (기본 16px 기준)
 */
export function convertPxToRem(pxValue: string, baseFontSize = 16): string {
  const match = pxValue.match(/^(\d*\.?\d+)px$/);
  if (match) {
    const px = parseFloat(match[1]);
    return `${px / baseFontSize}rem`;
  }
  return pxValue; // px가 아니면 원래 값 반환
}

/**
 * 반응형 브레이크포인트 CSS 생성
 */
export function generateResponsiveBreakpoints(breakpoints: ResponsiveBreakpoints): string {
  const rules: string[] = [];

  for (const [name, size] of Object.entries(breakpoints)) {
    rules.push(`@media (min-width: ${size}) {`);
    rules.push(`  /* ${name} breakpoint */`);
    rules.push(`}`);
  }

  return rules.join('\n');
}

/**
 * CSS 규칙 생성
 */
export function createCSSRule(selector: string, properties: CSSProperties): string {
  const rules: string[] = [`${selector} {`];

  for (const [property, value] of Object.entries(properties)) {
    rules.push(`  ${property}: ${value};`);
  }

  rules.push('}');

  return rules.join('\n');
}

/**
 * 클래스명 결합 및 조건부 처리
 */
export function combineClassNames(...inputs: ClassNameInput[]): string {
  const classNames: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classNames.push(String(input));
    } else if (typeof input === 'object') {
      for (const [className, condition] of Object.entries(input)) {
        if (condition) {
          classNames.push(className);
        }
      }
    }
  }

  // 중복 제거 및 공백으로 결합
  return Array.from(new Set(classNames.filter(Boolean))).join(' ');
}

/**
 * CSS 문자열 파싱 (간단한 구현)
 */
export function parseCSS(cssString: string): ParsedCSS {
  const parsed: ParsedCSS = {};

  try {
    // 간단한 CSS 파싱 (완전한 파서는 아님)
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;

    while ((match = ruleRegex.exec(cssString)) !== null) {
      const selector = match[1].trim();
      const declarationsStr = match[2];

      const properties: CSSProperties = {};
      const declarations = declarationsStr.split(';');

      for (const declaration of declarations) {
        const colonIndex = declaration.indexOf(':');
        if (colonIndex > 0) {
          const property = declaration.slice(0, colonIndex).trim();
          const value = declaration.slice(colonIndex + 1).trim();
          if (property && value) {
            properties[property] = value;
          }
        }
      }

      parsed[selector] = properties;
    }
  } catch {
    // 파싱 실패 시 빈 객체 반환
  }

  return parsed;
}