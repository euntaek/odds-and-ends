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
  return typeof error === 'string' ? { success: false, error: { message: error } } : { success: false, error };
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
    const exists = await User.findOneByEmail(email);
    if (exists) return failureData('존재하는 사용자입니다.');

    // 회원가입 트래잭션 (user, profile)
    const user = await getManager().transaction(async transactionalEntityManager => {
      try {
        // 프로필 저장
        const profile = await transactionalEntityManager.save(Profile.createOne({ displayName, about, thumbnail }));
        // 사용자 저장
        const hashedPassword = await hashPssword(password);
        return await transactionalEntityManager.save(User.createOne({ email, hashedPassword, username, profile }));
      } catch (error) {
        throw new InternalServerError({ message: '회원가입 실패', error });
      }
    });
    return successData(user);
  }

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

  // # 프로필 수정
  async editPforile(
    user: User,
    profileForm: { displayName?: string; about?: string; thumbnail?: string },
  ): Promise<ServiceData> {
    try {
      const { displayName: displayName, about } = profileForm;
      const isEdited = await Profile.upadteOne(user.profile.id, { displayName, about });
      if (!isEdited) {
        return failureData({ message: '프로필 수정 실패', error: 'isEdited is false' });
      }
      return successData();
    } catch (error) {
      throw new InternalServerError({ message: '프로필 수정 실패', error });
    }
  }

  // # 프로필 이미지 업로드
  async uploadThumbnail(user: User, file: S3File): Promise<ServiceData<boolean>> {
    try {
      const thumbnail = file.location;
      const isUpload = await Profile.upadteOne(user.profile.id, { thumbnail });
      if (!isUpload) {
        return failureData({ message: '프로필 수정 실패', error: 'isUpload is false' });
      }
      return successData();
    } catch (error) {
      throw new InternalServerError({ message: '프로필 이미지 업로드 실패', error });
    }
  }

  // # 새로고침
  async refresh(userId: string): Promise<ServiceData<UserToken>> {
    try {
      const user = await User.findOneById(userId);
      if (!user) return failureData({ message: '리프레쉬 실패', error: 'User not found' });
      const token = await user.generateUserToken();
      return successData(token);
    } catch (error) {
      throw new InternalServerError({ message: '리프레쉬 실패', error });
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
      const diffTime = new Date().getTime() - new Date(emailAuth.createdAt).getTime();
      const expired = diffTime > 1000 * 60 * 60 * 24;
      if (expired || emailAuth.confirmedAt) return failureData('만료 된 링크입니다.');

      //인증 완료
      const isUpdated = EmailAuthentication.upadteOne(emailAuth.id, { confirmedAt: new Date() });
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
        where: { id: emailAuth.userId, email: emailAuth.email },
      });
      if (!user) {
        return failureData({ message: '사용자 인증에 실패했습니다.', error: 'User not found' });
      }
      // 인증완료
      const isConfirmed = await User.upadteOne(user.id, { isConfirmed: true });
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

  // # 테스트
  async test(userId: string): Promise<any> {
    try {
      const data = await User.findOneByOptions({ where: { id: userId }, relations: ['posts'] });
      console.log(data);
    } catch (error) {
      throw new InternalServerError({ message: 'auth service test', error });
    }
  }
}

export default AuthService;
