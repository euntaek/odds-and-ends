import { FindOneOptions } from 'typeorm';

import { User, Profile, Follow, Post } from '@/entity';
import { InternalServerError } from '@/errors/errRequest';

function successData<T>(data?: T): ServiceData<T> {
  return { success: true, data };
}
function failureData(error: ErrorParams | string) {
  return typeof error === 'string'
    ? { success: false, error: { message: error } }
    : { success: false, error };
}

class UserService {
  // # 사용자 게시물 전체 조회
  async getAllUserPosts(user: User, pId?: string): Promise<ServiceData<Post[]>> {
    try {
      const posts = await Post.getAll(user.id, '', pId);
      return successData(posts);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'GET_ALL_USER_POST_ERROR' });
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
        throw new InternalServerError({
          name: 'PROFILE_UPDATE_ERROR',
          message: '프로필 업데이트에 실패했습니다.',
        });
      }
      return successData();
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'PROFILE_UPDATE_ERROR' });
    }
  }

  // # 프로필 이미지 업로드
  async updateOneThumbnail(user: User, file: S3File): Promise<ServiceData<boolean>> {
    try {
      const thumbnail = file.location;
      const isUpload = await Profile.upadteOne(user.profile.id, { thumbnail });
      if (!isUpload) {
        throw new InternalServerError({
          name: 'PROFILE_THUMBNAIL_UPDATE_ERROR',
          message: '프로필 섬네일 업데이트에 실패했습니다.',
        });
      }
      return successData();
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'PROFILE_THUMBNAIL_UPDATE_ERROR' });
    }
  }

  //# 사용자 가져오기
  async getOneUser(
    key: 'id' | 'username' | 'email',
    value: string,
    relation: null | 'soft' | 'hard' = null,
  ): Promise<ServiceData<User>> {
    try {
      const user = await User.findOneByKeyValue(key, value, relation);
      if (!user) {
        return failureData({ name: 'GET_ONE_USER', message: '존재하지 않는 사용자입니다.' });
      }
      console.log(user);
      return successData(user);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'GET_USERS_ERROR' });
    }
  }

  // # 팔로우
  async follow(user: User, targetUser: User): Promise<ServiceData<Follow>> {
    try {
      const follow = await Follow.createOneAndSave(user, targetUser);
      if (!follow) {
        return failureData({
          name: 'FOLLOW_ERROR',
          message: '회원가입 쿼리 실패(반환 값이 없음)',
        });
      }
      return successData(follow);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'FOLLOW_ERROR' });
    }
  }

  // # 팔로우 관계 체크
  async checkFollow(user: User, targetUser: User): Promise<ServiceData<Follow>> {
    try {
      const follow = await Follow.findOneById(user.id, targetUser.id);
      return successData(follow);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'CHECK_FOLLOW_ERROR' });
    }
  }

  // # 팔로워 조회
  async readFollowers(user: User): Promise<any> {
    try {
      const followers = await Follow.readFollowersById(user.id);
      return successData(followers);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'READ_FOLLOWERS_ERROR' });
    }
  }

  // # 팔로잉 조회
  async readFollowings(user: User): Promise<any> {
    try {
      const followers = await Follow.readFollowingsById(user.id);
      return successData(followers);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'READ_FOLLOWERS_ERROR' });
    }
  }

  // # 테스트
  async test(): Promise<any> {
    try {
      const followers = await Follow.readFollowersById('ae3c79bb-e736-4519-bfb0-273117a5aaae');
      return followers;
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'AUTH_SERVICE_TEST' });
    }
  }
}

export default UserService;
