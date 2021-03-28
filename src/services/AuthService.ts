import { DeepPartial, getManager } from 'typeorm';

import { User, Profile, EmailAuthentication } from '@/entity';

import { hashPssword, generateRandomToken } from '@/utils/auth';
import { InternalServerError } from '@/errors/errRequest';
import { createEmailTemplate } from '@/etc/emailTemplates';
import sendMail from '@/utils/sendMail';

function successData<T>(data?: T): ServiceData<T> {
  return { success: true, data };
}
function failureData(error: ErrorParams | string) {
  return typeof error === 'string'
    ? { success: false, error: { message: error } }
    : { success: false, error };
}

class AuthService {
  // # 화원가입
  async register(registerForm: {
    email: string;
    password: string;
    username: string;
    displayName: string;
    about: string;
    thumbnail?: string;
  }): Promise<ServiceData<User>> {
    const { email, password, username, displayName, about, thumbnail } = registerForm;

    // 사용자 유무 확인
    const isExisted = !!(await User.findOneByKeyValue('email', email));
    if (isExisted) {
      return failureData({ name: 'REGISTER_FAILURE', message: '이미 사용 중인 이메일입니다' });
    }

    // 회원가입 트래잭션 (user, profile)
    const createdUser = await getManager().transaction(async transactionalEntityManager => {
      try {
        // 프로필 생성 및 저장
        const profile = await transactionalEntityManager.save(
          Profile.createOne({ displayName, about, thumbnail }),
        );
        // 사용자 생성 및 저장
        const hashedPassword = await hashPssword(password);
        const user = await transactionalEntityManager.save(
          User.createOne({ email, hashedPassword, username, profile }),
        );
        if (!user) {
          throw new InternalServerError({
            name: 'REGISTER_ERROR',
            message: '회원가입 쿼리 실패(리턴 값이 존재하지 않음)',
          });
        }
        return user;
      } catch (error) {
        throw new InternalServerError({ ...error, name: 'REGISTER_ERROR' });
      }
    });

    return successData(createdUser);
  }

  // # 로그인
  async login(loginForm: { email: string; password: string }): Promise<ServiceData<LoginData>> {
    try {
      const { email, password } = loginForm;

      // 사용자 확인
      const user = await User.findOneByKeyValue('email', email, 'soft');
      const isPsswordValid = await user?.checkPassword(password);

      // 사용자 존재 유무와 비밀번호 확인
      if (!user || !isPsswordValid) {
        return failureData({
          name: 'LOGIN_FAILURE',
          message: '잘못 된 이메일 주소 또는 비밀번호입니다.',
        });
      }

      // access token, refresh token 발급
      const token = await user.generateUserToken();
      return successData({ user, ...token });
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'lOGIN_ERROR' });
    }
  }

  // # 새로고침
  async refresh(userId: string): Promise<ServiceData<UserToken>> {
    try {
      const user = await User.findOneByKeyValue('id', userId);
      if (!user) {
        return failureData({ name: 'REFRESH_FAILURE', message: '존재하지 않는 사용자입니다.' });
      }
      const token = await user.generateUserToken();
      return successData(token);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'REFRESH_ERROR' });
    }
  }

  // # 이메일 전송

  async sendMail(type: 'register' | 'resetPassword', user: User): Promise<ServiceData> {
    try {
      const { id: userId, email } = user;
      const token = generateRandomToken();

      const emailAuth = await EmailAuthentication.createOneAndSave({ type, userId, email, token });
      const emailTemplate = createEmailTemplate(type, user, emailAuth.token);
      const result = await sendMail({ to: user.email, ...emailTemplate });
      return result;
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'SEND_MAIL_ERROR' });
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
      if (!emailAuth) {
        return failureData({ name: 'EMAIL_AUTH_FAILURE', message: '잘못 된 이메일입니다.' });
      }
      if (emailAuth.confirmedAt) {
        return failureData({ name: 'EMAIL_AUTH_FAILURE', message: '이미 인증 된 이메일입니다.' });
      }
      // 유효시간, 이미 사용 된 링크인지 확인
      const diffTime = new Date().getTime() - new Date(emailAuth.createdAt).getTime();
      const isExpired = diffTime > 1000 * 60 * 60 * 24;
      if (isExpired) {
        return failureData({
          name: 'EMAIL_AUTH_FAILURE',
          message: '인증 가능한 시간을 초과 된 이메일입니다.',
        });
      }

      //인증 완료
      const isUpdated = EmailAuthentication.upadteOne(emailAuth.id, { confirmedAt: new Date() });
      if (!isUpdated) {
        throw new InternalServerError({
          name: 'EMAIL_AUTH_ERROR',
          message: '이메일 인증 업데이트에 실패했습니다.',
        });
      }

      return successData(emailAuth);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'EMAIL_AUTH_ERROR' });
    }
  }

  // # 사용자 확인
  async userConfirmation(emailAuth: DeepPartial<EmailAuthentication>): Promise<ServiceData> {
    try {
      // 사용자 이메일, uuid 확인
      const user = await User.findOneByOptions({
        where: { id: emailAuth.userId, email: emailAuth.email },
      });
      if (!user) {
        return failureData({
          name: 'USER_CONFIRMATION_FAILURE',
          message: '존재하지 않는 사용자입니다.',
        });
      }
      // 확인 완료
      const isConfirmed = await User.upadteOne(user.id, { isConfirmed: true });
      if (!isConfirmed) {
        throw new InternalServerError({
          name: 'USER_CONFIRMATION_ERROR',
          message: '사용자 확인 업데이트에 실패했습니다.',
        });
      }
      return successData();
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'USER_CONFIRMATION_ERROR' });
    }
  }

  // # 테스트
  async test(userId: string): Promise<any> {
    try {
      const data = await User.findOneByOptions({ where: { id: userId }, relations: ['posts'] });
      console.log(data);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'AUTH_SERVICE_TEST_ERROR' });
    }
  }
}

export default AuthService;
