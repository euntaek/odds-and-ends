import Head from 'next/head';
import { css } from '@emotion/react';

import Icon from '@/components/common/Icon';
import { styleHelper } from '@/lib/styles';
import EmailCheckForm from '@/components/Auth/EmailCheckForm';

function Index() {
  return (
    <>
      <Head>
        <title>Teanpho</title>
        <meta name="description" content="teanpho 시작하기 페이지" />
      </Head>
      <section css={sytle}>
        <h1>teanpho</h1>
        <Icon name="logo_text" className="logo-text" />
        <p className="introduction">짧은 글과 사진을 통해 여러 사람들과 소통해보세요.</p>
        <EmailCheckForm />
      </section>
    </>
  );
}

const sytle = css`
  ${styleHelper.alignCenter}
  width: 272px;

  h1 {
    ${styleHelper.hidden}
  }
  .logo-text {
    margin-bottom: 24px;
  }
  .introduction {
    margin-bottom: 32px;
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
  }
`;

export default Index;
