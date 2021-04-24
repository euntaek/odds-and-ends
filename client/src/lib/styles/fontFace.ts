import { css } from '@emotion/react';

export const fontFace = css`
  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/static/fonts/NotoSansKR/NotoSansKR-Regular.woff2') format('woff2'),
      url('/static/fonts/NotoSansKR/NotoSansKR-Regular.woff') format('woff');
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }
  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/static/fonts/NotoSansKR/NotoSansKR-Medium.woff2') format('woff2'),
      url('/static/fonts/NotoSansKR/NotoSansKR-Medium.woff') format('woff');
    font-style: normal;
    font-weight: 500;
    font-display: swap;
  }
  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/static/fonts/NotoSansKR/NotoSansKR-Bold.woff2') format('woff2'),
      url('/static/fonts/NotoSansKR/NotoSansKR-Bold.woff') format('woff');
    font-style: normal;
    font-weight: 700;
    font-display: swap;
  }
`;
