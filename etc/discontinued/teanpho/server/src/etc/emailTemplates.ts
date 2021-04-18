import { User } from '@/entity';

export const createEmailTemplate = (
  type: 'register' | 'resetPassword',
  user: User,
  token: string,
): { subject: string; html: string } => {
  switch (type) {
    case 'register':
      return confirmationTemplate(user.profile.displayName, token);
    default:
      return { html: '', subject: '' };
  }
};

const confirmationTemplate = (displayName: string, token: string) => {
  const subject = '[Teanpho] 이메일 인증을 해주세요.';
  const html = `
  <div style="padding: 26px 18px">
      <h1
        style="
          margin-top: 23px;
          margin-bottom: 9px;
          color: #222222;
          font-size: 19px;
          line-height: 28px;
          letter-spacing: -0.27px;
        "
      >
        ${displayName}님 안녕하세요.
      </h1>
      <div style="margin-top: 7px; margin-bottom: 22px; color: #222222">
        <p
          style="
            margin-block-start: 0;
            margin-block-end: 0;
            margin-inline-start: 0;
            margin-inline-end: 0;
            line-height: 1.47;
            letter-spacing: -0.22px;
            font-size: 15px;
            margin: 8px 0 0;
          "
        >
          이메일 인증 완료를 위해 아래 버튼을 눌러주세요.
        </p>
        <a
          class="btn"
          href=http://localhost:3000/api/v1/auth/test/${token}
          style="
            text-decoration: none;
            color: white;
            display: inline-block;
            font-size: 15px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-: normal;
            letter-spacing: normal;
            border-radius: 2px;
            background-color: #141517;
            margin: 24px 0 19px;
            padding: 11px 6px;
          "
          rel="noreferrer noopener"
          target="_blank"
          >이메일 인증하기</a
        >

        <p
          style="
            margin-block-start: 0;
            margin-block-end: 0;
            margin-inline-start: 0;
            margin-inline-end: 0;
            line-height: 1.47;
            letter-spacing: -0.22px;
            font-size: 15px;
            margin: 20px 0;
          "
        >
          감사합니다.
        </p>
      </div>
    </div>
  `;
  return {
    subject,
    html,
  };
};
