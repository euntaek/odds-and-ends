import { DeepPartial, FindOneOptions, getManager } from 'typeorm';

import User from '../entity/User';
import Profile from '../entity/Profile';
import EmailAuthentication from '../entity/EmailAuthentication';
import { hashPssword, generateRandomToken } from '../utils/auth';
import { InternalServerError } from '../errors/errRequest';
import { createEmailTemplate } from '../etc/emailTemplates';
import sendMail from '../utils/sendMail';

function successData<T>(data?: T): ServiceData<T> {
  return { success: true, data };
}
function failureData(error: ErrorParams | string) {
  return typeof error === 'string'
    ? { success: false, error: { message: error } }
    : { success: false, error };
}

class AuthService {
  // # 로그인
  async login(loginForm: { email: string; password: string }): Promise<ServiceData<LoginData>> {
    try {
      const { email, password } = loginForm;

      // 사용자 확인
      const user = await User.findOneByEmail(email);

      // 사용자 존재 유무와 비밀번호 확인
      if (!user || !(await user.checkPassword(password))) {
        return failureData('이메일 또는 비밀번호를 잘못 입력하셨습니다.');
      }

      // access token, refresh token 발급
      const token = await user.generateUserToken();
      return successData({ user, ...token });
    } catch (error) {
      throw new InternalServerError({ message: '로그인 실패', error });
    }
  }

  // # 화원가입
  async register(registerForm: {
    email: string;
    password: string;
    username: string;
    displayName: string;
    about: string;
    thumbnail?: string;
  }): Promise<ServiceData<UserInfo>> {
    const { email, password, username, displayName: display_name, about, thumbnail } = registerForm;

    // 사용자 유무 확인
    const exists = await User.findOneByEmail(email);
    if (exists) return failureData('존재하는 사용자입니다.');

    // 회원가입 트래잭션 (user, profile)
    const user = await getManager().transaction(async transactionalEntityManager => {
      try {
        // profile 생성
        const profile = await Profile.createOne({ display_name, about, thumbnail });
        await transactionalEntityManager.save(profile);

        // 사용자 생성
        const hashed_password = await hashPssword(password);
        const user = await User.createOne({ email, hashed_password, username, profile });
        await transactionalEntityManager.save(user);

        return user;
      } catch (error) {
        throw new InternalServerError({ message: '회원가입 실패', error });
      }
    });
    return successData(user.serialize());
  }

  // # 새로고침
  async refresh(_id: string): Promise<ServiceData<UserToken>> {
    const user = await User.findOneByUUID(_id);
    if (!user) return failureData({ message: '리프레쉬 실패', error: '사용자가 존재 하지 않음' });
    const token = await user.generateUserToken();
    return successData(token);
  }

  // # 이메일 전송
  async sendMail(type: 'register' | 'resetPassword', user: UserInfo): Promise<ServiceData> {
    try {
      const { _id: user_id, email } = user;
      const token = generateRandomToken();

      const emailAuth = await EmailAuthentication.createOne({ type, user_id, email, token });
      const emailTemplate = createEmailTemplate(type, user, emailAuth.token);
      const result = await sendMail({ to: user.email, ...emailTemplate });
      return result;
    } catch (error) {
      throw new InternalServerError({ message: '이메일 전송 실패', error });
    }
  }

  // # 이메일 인증
  async emailAuthentication(
    emailAuthToken: string,
    type: 'register' | 'resetPassword',
  ): Promise<ServiceData<EmailAuthentication>> {
    try {
      // 이메일 인증 row 확인
      const emailAuth = await EmailAuthentication.findOneByTokenAndType(emailAuthToken, type);
      if (!emailAuth) return failureData({ message: '잘못 된 링크입니다.', error: 404 });

      // 유효시간, 이미 사용 된 링크인지 확인
      const diffTime = new Date().getTime() - new Date(emailAuth.created_at).getTime();
      const expired = diffTime > 1000 * 60 * 60 * 24;
      if (expired || emailAuth.confirmed_at) return failureData('만료 된 링크입니다.');

      //인증 완료
      const isUpdated = EmailAuthentication.upadteOne(emailAuth.id, { confirmed_at: new Date() });
      if (!isUpdated) {
        throw new InternalServerError({
          message: '이메일 인증 업데이트 실패',
          error: 'AuthService/emailAuthentication/EmailAuthentication.upadteOne',
        });
      }

      return successData(emailAuth);
    } catch (error) {
      throw new InternalServerError({ message: '이메일 인증실패', error });
    }
  }

  // # 사용자 인증
  async userConfirmation(emailAuth: DeepPartial<EmailAuthentication>): Promise<ServiceData> {
    try {
      // 사용자 이메일, uuid 확인
      const user = await User.findOneByOptions({
        where: { _id: emailAuth.user_id, email: emailAuth.email },
      });
      if (!user) {
        return failureData({ message: '사용자 인증에 실패했습니다.', error: 'User not found' });
      }
      // 인증완료
      const isConfirmed = await User.upadteOne(user.id, { is_confirmed: true });
      if (!isConfirmed) {
        throw new InternalServerError({
          message: '사용자 업데이트 실패',
          error: 'AuthService/emailAuthentication/userConfirmation.upadteOne',
        });
      }
      return successData();
    } catch (error) {
      throw new InternalServerError({ message: '사용자 인증 실패', error });
    }
  }

  // # 사용자 찾기
  async findUsersByOptions(options: FindOneOptions<User>): Promise<ServiceData<UserInfo>> {
    const user = await User.findOneByOptions(options);

    if (!user) return failureData('존재하지 않는 사용자입니다.');
    return successData(user.serialize());
  }
}

export default AuthService;
