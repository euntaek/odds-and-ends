import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import UserService from '../../services/UserService';

import { generateSchemaAndValue, validateSchema } from '../../utils/reqValidation';
import { BadRequest, Conflict, NotFound, Unauthorized } from '../../errors/errRequest';

// # 사용자 조회(전체)
export const list: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = '사용자 조회(전체)';
};

// # 사용자 조회
export const read: Middleware = async ctx => {
  const { idOrUsername }: { idOrUsername: string } = ctx.params;
  const isUsername = idOrUsername[0] === '@';
  const schemaAndValue = generateSchemaAndValue(
    isUsername ? { username: idOrUsername.slice(1) } : { id: idOrUsername },
  );
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }
  const userService = new UserService();
  const getOneUserResult = await userService.getOneUser(schemaAndValue[1]);
  if (!getOneUserResult.success) {
    throw new BadRequest(getOneUserResult.error);
  }
  ctx.status = StatusCodes.OK;
  ctx.body = getOneUserResult.data;
};

export const userPosts: Middleware = async ctx => {
  const { id: userId }: { id: string } = ctx.params;
  const schemaAndValue = generateSchemaAndValue({ userId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }

  ctx.status = StatusCodes.OK;
};

export const userComments: Middleware = async ctx => {
  const { id: userId }: { id: string } = ctx.params;
  const schemaAndValue = generateSchemaAndValue({ userId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }

  ctx.status = StatusCodes.OK;
};

// # 중복 확인
export const duplicateCheck: Middleware = async ctx => {
  const data: { email?: string; username?: string } = ctx.request.query;
  const schemaAndValue = generateSchemaAndValue(data);
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }
  const userService = new UserService();
  const result = await userService.findUsersByOptions({ where: { ...data } });
  if (result.success) {
    throw new Conflict({ message: '존재하는 사용자입니다.', error: { query: data } });
  }
  ctx.status = StatusCodes.OK;
  ctx.body = { mesage: `사용 가능한 ${Object.keys(data).join(', ')} 입니다.` };
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

// thumbnail 업로드
export const uploadThumbnail: Middleware = async ctx => {
  const userService = new UserService();
  const result = await userService.updateOneThumbnail(ctx.state.user, ctx.request.file);
  if (!result.success) {
    throw new BadRequest(result.error);
  }
  ctx.status = StatusCodes.NO_CONTENT;
};
