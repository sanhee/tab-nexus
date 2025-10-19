import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App 컴포넌트', () => {
  it('앱이 정상적으로 렌더링되어야 한다', () => {
    render(<App />);

    // Vite 기본 텍스트 확인
    expect(screen.getByText(/vite/i)).toBeInTheDocument();
  });

  it('React 로고가 표시되어야 한다', () => {
    render(<App />);

    const reactLogo = screen.getByAltText(/react logo/i);
    expect(reactLogo).toBeInTheDocument();
  });
});
