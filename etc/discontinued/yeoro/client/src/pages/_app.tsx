import { AppProps } from 'next/app';
import { Global } from '@emotion/react';

import { globalStyle } from '@/lib/styles';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global styles={globalStyle} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
