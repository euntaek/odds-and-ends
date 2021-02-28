import { Global } from '@emotion/react';
import { globalStyle } from '@/lib/styles';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Global styles={globalStyle} />
    </>
  );
}

export default MyApp;
