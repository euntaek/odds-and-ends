import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import UserService from '../../services/UserService';

import { generateSchemaAndValue, validateSchema } from '../../utils/reqValidation';
import { BadRequest } from '../../errors/errRequest';
import Follow from '../../entity/Follow';

// # 사용자 조회(전체)
export const list: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = '사용자 조회(전체)';
};

// # 사용자 조회
export const read: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = { targetUser: ctx.state.targetUser, follow: ctx.state.follow };
};

// # 사용자 게시물 조회(전체)
export const userPosts: Middleware = async ctx => {
  const { 'p-id': pId }: { 'p-id': string } = ctx.request.query;

  const schemaAndValue = generateSchemaAndValue({ pId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }
  const userService = new UserService();
  const listResult = await userService.getAllPost(ctx.state.user, pId);
  ctx.status = StatusCodes.OK;
  ctx.body = listResult.data;
};

// # 사용자 댓글 조회(전체) -- 추후 구현
export const userComments: Middleware = async ctx => {
  const { id: userId }: { id: string } = ctx.params;
  const schemaAndValue = generateSchemaAndValue({ userId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }

  ctx.status = StatusCodes.OK;
};

// # 중복 확인
export const checkDuplicate: Middleware = async ctx => {
  const query: { email?: string; username?: string } = ctx.request.query;
  const schemaAndValue = generateSchemaAndValue(query);
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }

  const userService = new UserService();
  const result = await userService.findUsersByOptions({ where: { ...query } });

  ctx.status = StatusCodes.OK;
  ctx.body = { user: result.data || null };
};

// # 프로필 수정
export const editProfile: Middleware = async ctx => {
  interface RequestBody {
    displayName?: string;
    about?: string;
  }
  const profileForm: RequestBody = ctx.request.body;

  const schemaAndValue = generateSchemaAndValue(profileForm);
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const userService = new UserService();
  const pfofileEditResult = await userService.updateOneProfile(ctx.state.user, profileForm);
  if (!pfofileEditResult.success) {
    throw new BadRequest(pfofileEditResult.error);
  }
  const userResult = await userService.findUsersByOptions(ctx.state.user.id);
  if (!userResult.success) {
    throw new BadRequest(userResult.error);
  }
  ctx.status = StatusCodes.OK;
  ctx.body = userResult.data;
};

// # thumbnail 업로드
export const uploadThumbnail: Middleware = async ctx => {
  const userService = new UserService();
  const result = await userService.updateOneThumbnail(ctx.state.user, ctx.request.file);
  if (!result.success) {
    throw new BadRequest(result.error);
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

// # 팔로우
export const follow: Middleware = async ctx => {
  if (ctx.state.user.id === ctx.state.targetUser.id) {
    throw new BadRequest('자기 자신을 팔로우할 수 없습니다.');
  }
  if (ctx.state.follow) {
    throw new BadRequest('이미 팔로우한 유저입니다.');
  }
  const userService = new UserService();
  const followResult = await userService.follow(ctx.state.user, ctx.state.targetUser);
  if (followResult.error) {
    throw new BadRequest();
  }
  ctx.status = StatusCodes.OK;
  ctx.body = followResult.data;
};

// # 언팔로우
export const unfollow: Middleware = async ctx => {
  if (ctx.state.user.id === ctx.state.targetUser.id) {
    throw new BadRequest('자기 자신을 언팔로우할 수 없습니다.');
  }
  if (!ctx.state.follow) {
    throw new BadRequest('팔로우 관계가 아닙니다.');
  }
  await (ctx.state.follow as Follow).remove();
  ctx.status = StatusCodes.OK;
  ctx.body = 'unfollow';
};

// # 팔로워 조회
export const followers: Middleware = async ctx => {
  const userService = new UserService();
  const followersResult = await userService.getAllFollowers(ctx.state.user);
  ctx.status = StatusCodes.OK;
  ctx.body = followersResult.data;
};

// # 팔로잉 조회
export const followings: Middleware = async ctx => {
  const userService = new UserService();
  const followersResult = await userService.getAllFollowings(ctx.state.user);
  ctx.status = StatusCodes.OK;
  ctx.body = followersResult.data;
};

// # 유저 체크
export const checkUser: Middleware = async (ctx, next) => {
  const { idOrUsername }: { idOrUsername: string } = ctx.params;

  const isUsername = idOrUsername[0] === '@';
  const { key, value }: { key: 'id' | 'username'; value: string } = isUsername
    ? { key: 'username', value: idOrUsername.slice(1) }
    : { key: 'id', value: idOrUsername };

  const schemaAndValue = generateSchemaAndValue({ [key]: value });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }

  const userService = new UserService();
  console.log('\x1b[32m%s\x1b[0m', 'start--------------check user--------------');
  const getOneUserResult = await userService.getOneUser(key, value);
  console.log('\x1b[32m%s\x1b[0m', 'end----------------check user--------------');
  if (!getOneUserResult.success) {
    throw new BadRequest(getOneUserResult.error);
  }
  ctx.state.targetUser = getOneUserResult.data;
  return next();
};

// # 팔로우 체크
export const checkFollow: Middleware = async (ctx, next) => {
  if (!ctx.state.user || !ctx.state.targetUser || ctx.state.user.id === ctx.state.targetUser.id) {
    return next();
  }
  const userService = new UserService();
  console.log('\x1b[32m%s\x1b[0m', 'start--------------follow user--------------');
  const getOneFollowResult = await userService.getOneFollow(ctx.state.user, ctx.state.targetUser);
  console.log('\x1b[32m%s\x1b[0m', 'end----------------follow user--------------');
  console.log(getOneFollowResult.data);
  ctx.state.follow = getOneFollowResult.data;
  return next();
};

export const test: Middleware = async ctx => {
  const userService = new UserService();

  const data = await userService.test();

  ctx.status = StatusCodes.OK;
  ctx.body = data;
};
