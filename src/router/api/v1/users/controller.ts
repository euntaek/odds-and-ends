import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import { Follow } from '@/entity';
import UserService from '@/services/UserService';

import { generateSchemaAndValue, validateSchema } from '@/utils/reqValidation';
import { BadRequest, InternalServerError } from '@/errors/errRequest';

/**
 * 사용자 전체 조회
 * GET api/v1/users
 * TODO:
 * 다음에 필요하면 만들자.
 * 어드민 서비스가 아닌 이상 사용자 전체 목록이 필요한 경우는 없을 듯.
 */
export const list: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = '사용자 조회(전체)';
};

/**
 * 사용자 조회
 * GET api/v1/users/:id|:username
 */
export const read: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = { targetUser: ctx.state.targetUser, isFollowing: ctx.state.isFollowing };
};

/**
 * 사용자 게시물 전체 조회
 * GET api/v1/users/:id|:username/posts
 */
export const userPosts: Middleware = async ctx => {
  const { 'p-id': pId }: { 'p-id': string } = ctx.request.query;

  const schemaAndValue = generateSchemaAndValue({ pId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }
  const userService = new UserService();
  const listResult = await userService.getAllUserPosts(ctx.state.targetUser, pId);
  ctx.status = StatusCodes.OK;
  ctx.body = { targetUserPosts: listResult.data };
};

/**
 * 사용자 댓글 조회
 * GET api/v1/users/:id|:username/comments
 * TODO:
 * 다음에 필요하면 만들자.
 * 당장 필요하지는 않을 듯.
 * 상대방 댓글까지 보는 건 당장 나한테는 너무 무리인 듯.
 * 욕심내지 말고 천천히 하자.
 */
export const userComments: Middleware = async ctx => {
  const { id: userId }: { id: string } = ctx.params;
  const schemaAndValue = generateSchemaAndValue({ userId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  ctx.status = StatusCodes.OK;
};

/**
 * email, username 중복체크
 * GET api/v1/users/duplicate-check?email=&username=
 */
export const checkDuplicate: Middleware = async ctx => {
  const { key, value }: { key: 'email' | 'username'; value: string } = ctx.request.query;
  const schemaAndValue = generateSchemaAndValue({ [key]: value });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  const userService = new UserService();
  const duplicateCheckResult = await userService.getOneUser(key, value);
  if (!duplicateCheckResult.success) {
    ctx.status = StatusCodes.OK;
    ctx.body = { user: null, isNotDuplicated: true };
    return;
  }
  ctx.status = StatusCodes.OK;
  ctx.body = { key, value, isNotDuplicated: true };
};

/**
 * 프로필 수정
 * PATCH api/v1/users/profile
 */
export const editProfile: Middleware = async ctx => {
  interface RequestBody {
    displayName?: string;
    about?: string;
  }
  const profileForm: RequestBody = ctx.request.body;

  const schemaAndValue = generateSchemaAndValue(profileForm);
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  const userService = new UserService();
  const pfofileEditResult = await userService.updateOneProfile(ctx.state.user, profileForm);
  if (!pfofileEditResult.success) {
    return ctx.throw(new BadRequest(pfofileEditResult.error));
  }
  const getOneUserResult = await userService.getOneUser('id', ctx.state.user.id, 'hard');
  if (!getOneUserResult.success) {
    return ctx.throw(new BadRequest(getOneUserResult.error));
  }
  ctx.status = StatusCodes.OK;
  ctx.body = { user: getOneUserResult.data };
};

/**
 * thumbnail 업로드
 * PATCH api/v1/users/thumbnail
 */
export const uploadThumbnail: Middleware = async ctx => {
  const userService = new UserService();
  const result = await userService.updateOneThumbnail(ctx.state.user, ctx.request.file);
  if (!result.success) {
    return ctx.throw(new BadRequest(result.error));
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

/**
 * 팔로우
 * POST api/v1/users/:id|:username/follow
 */
export const follow: Middleware = async ctx => {
  if (ctx.state.isFollowing) {
    return ctx.throw(
      new BadRequest({ name: 'FOLLOW_FAILURE', message: '이미 팔로우한 유저입니다.' }),
    );
  }
  const userService = new UserService();
  const followResult = await userService.follow(ctx.state.user, ctx.state.targetUser);
  if (!followResult.success) {
    return ctx.throw(new InternalServerError(followResult.error));
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

/**
 * 언팔로우
 * POST api/v1/users/:id|:username/unfollow
 */
export const unfollow: Middleware = async ctx => {
  if (!ctx.state.isFollowing) {
    return ctx.throw(
      new BadRequest({ name: 'UNFOLLOW_FAILURE', message: '팔로우 관계가 아닙니다.' }),
    );
  }
  const follow = ctx.state.follow as Follow;
  const unfollwResult = await follow.remove();
  if (!unfollwResult) {
    return ctx.throw(
      new InternalServerError({
        name: 'UNFOLLOW_ERROR',
        message: '언팔로우 쿼리 실패(반환 값이 없음)',
      }),
    );
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

/**
 * 팔로워 전체 조회
 * GET api/v1/users/followers
 */
export const followers: Middleware = async ctx => {
  const userService = new UserService();
  const followersResult = await userService.readFollowers(ctx.state.user);
  ctx.status = StatusCodes.OK;
  ctx.body = { followers: followersResult.data };
};

/**
 * 팔로잉 전체 조회
 * GET api/v1/users/followings
 */
export const followings: Middleware = async ctx => {
  const userService = new UserService();
  const followersResult = await userService.readFollowings(ctx.state.user);
  ctx.status = StatusCodes.OK;
  ctx.body = { followings: followersResult.data };
};
