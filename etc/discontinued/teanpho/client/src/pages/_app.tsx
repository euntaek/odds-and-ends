import Head from 'next/head';
import { Global, css } from '@emotion/react';

import { globalStyle, styleHelper } from '@/lib/styles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ViewportMetaLink = () => (
  <meta
    name="viewport"
    content="initial-scale=1.0, user-scalable=no, maximum-scale=1, width=device-width"
  />
);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <ViewportMetaLink />
      </Head>
      <Header />
      <main
        css={css`
          ${styleHelper.alignCenter}
          width: 100%;
          height: 90vh;
        `}
      >
        <Component {...pageProps} />
      </main>
      <Footer />
      <Global styles={globalStyle} />
    </>
  );
}

export default MyApp;
