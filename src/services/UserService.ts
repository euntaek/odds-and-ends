import { FindOneOptions } from 'typeorm';

import User from '../entity/User';
import Profile from '../entity/Profile';
import Follow from '../entity/Follow';
import Post from '../entity/Post';

import { InternalServerError } from '../errors/errRequest';

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

  //# 사용자 가져오기
  async getOneUser(key: 'id' | 'username', value: string): Promise<ServiceData<User>> {
    try {
      const user = await User.findOneByKeyValue(key, value);
      if (!user) return failureData('존재하지 않는 사용자입니다.');
      return successData(user);
    } catch (error) {
      throw new InternalServerError({ message: '사용자 가져오기 실패', error });
    }
  }

  // # 팔로우
  async follow(user: User, targetUser: User): Promise<ServiceData<Follow>> {
    try {
      const follow = await Follow.createOneAndSave(user.id, targetUser.id);
      return successData(follow);
    } catch (error) {
      throw new InternalServerError({ message: '팔로우 실패', error });
    }
  }

  // # 팔로우 관계 가져오기
  async getOneFollow(user: User, targetUser: User): Promise<ServiceData<Follow>> {
    try {
      const follow = await Follow.findOneById(user.id, targetUser.id);
      if (!follow) return failureData('팔로우 관계가 아닙니다.');
      return successData(follow);
    } catch (error) {
      throw new InternalServerError({ message: '팔로우 관계 가져오기 실패', error });
    }
  }

  // async getManyFollower(user: User): Promise<any> {
  //   try {
  //   } catch (error) {}
  // }

  // # 테스트
  async test(): Promise<any> {
    try {
      return await User.findOneByKeyValue('id', 'e2e6d849-a5e8-4aad-b627-7390c263d229');
    } catch (error) {
      throw new InternalServerError({ message: 'auth service test', error });
    }
  }
}

export default UserService;
