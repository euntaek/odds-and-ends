import { css, Global } from '@emotion/react';
import reset from 'emotion-reset';

export const GlobalStyles = () => (
  <Global
    styles={css`
      ${reset}
      *, *::after, *::before {
        box-sizing: border-box;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
      }
    `}
  />
);
