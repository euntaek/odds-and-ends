import { DeepPartial, FindOneOptions, getManager } from 'typeorm';

import User from '../entity/User';
import Profile from '../entity/Profile';

import { InternalServerError } from '../errors/errRequest';
import { createEmailTemplate } from '../etc/emailTemplates';
import sendMail from '../utils/sendMail';
import Post from '../entity/Post';

function successData<T>(data?: T): ServiceData<T> {
  return { success: true, data };
}
function failureData(error: ErrorParams | string) {
  return typeof error === 'string' ? { success: false, error: { message: error } } : { success: false, error };
}

class UserService {
  async getAllPost(user: User, pId?: string): Promise<ServiceData<any>> {
    try {
      const posts = await Post.getAll(user.id, '', pId);
      return successData(posts);
    } catch (error) {
      return failureData({ message: '게시물 조회 실패', error });
    }
  }

  // # 프로필 수정
  async updateOneProfile(
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
  async updateOneThumbnail(user: User, file: S3File): Promise<ServiceData<boolean>> {
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

  // # 사용자 찾기
  async findUsersByOptions(options: FindOneOptions<User>): Promise<ServiceData<User>> {
    try {
      const user = await User.findOneByOptions(options);

      if (!user) return failureData('존재하지 않는 사용자입니다.');
      return successData(user);
    } catch (error) {
      throw new InternalServerError({ message: '사용자 찾기 실패', error });
    }
  }

  async getOneUser(key: 'id' | 'username', value: string): Promise<ServiceData<User>> {
    try {
      const user = await User.findOneByKeyValue(key, value);
      if (!user) return failureData('존재하지 않는 사용자입니다.');
      return successData(user);
    } catch (error) {
      throw new InternalServerError({ message: '사용자 가져오기 실패', error });
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

export default UserService;
