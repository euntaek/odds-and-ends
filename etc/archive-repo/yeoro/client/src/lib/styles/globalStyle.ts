import { css } from '@emotion/react';
import emotionReset from 'emotion-reset';
import { fontFace } from './fontFace';

export const globalStyle = css`
  ${emotionReset}
  ${fontFace}
  
  *, *::after, *::before {
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
  }

  body {
    font-family: Noto Sans KR, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 16px;
  }
  a {
    text-decoration: none;
  }
  input {
    -webkit-appearance: none;
  }
`;
