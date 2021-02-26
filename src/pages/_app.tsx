import { css, Global } from '@emotion/react';
import reset from 'emotion-reset';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Global styles={globalStyle} />
    </>
  );
}

const globalStyle = css`
  ${reset}
  *, *::after, *::before {
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }
`;

export default MyApp;
