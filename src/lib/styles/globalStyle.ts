import { css } from '@emotion/react';
import reset from 'emotion-reset';

const fontFace = css`
  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/fonts/NotoSansKR/NotoSansKR-Regular.woff2') format('woff2'),
      url('/fonts/NotoSansKR/NotoSansKR-Regular.woff') format('woff');
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }
  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/fonts/NotoSansKR/NotoSansKR-Medium.woff2') format('woff2'),
      url('/fonts/NotoSansKR/NotoSansKR-Medium.woff') format('woff');
    font-style: normal;
    font-weight: 500;
    font-display: swap;
  }
  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/fonts/NotoSansKR/NotoSansKR-Bold.woff2') format('woff2'),
      url('/fonts/NotoSansKR/NotoSansKR-Bold.woff') format('woff');
    font-style: normal;
    font-weight: 700;
    font-display: swap;
  }
`;

export const globalStyle = css`
  ${reset}
  ${fontFace}
  *, *::after, *::before {
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font: 1rem/1.75 Noto Sans KR, sans-serif;
  }
`;
