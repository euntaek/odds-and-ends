import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import AuthService from '../../services/AuthService';

import { REFRESH_TOKEN_SECRET } from '../../constans';
import { generateSchema, validateSchema } from '../../utils/reqValidation';
import { BadRequest, Conflict, NotFound, Unauthorized } from '../../errors/errRequest';

// # 회원가입
export const register: Middleware = async ctx => {
  interface RequestBody {
    email: string;
    password: string;
    username: string;
    displayName: string;
    about: string;
    thumbnail: string;
  }
  const userForm: RequestBody = ctx.request.body;

  const schema = generateSchema(userForm);
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const authService = new AuthService();
  const registerResult = await authService.register(userForm);

  if (!registerResult.success || !registerResult.data) {
    throw new Conflict('회원가입 실패');
  }

  const createdUser = registerResult.data;

  // 회원가입 인증 이메일 전송
  // const sendMailResult = await authService.sendMail('register', createdUser);

  // if (!sendMailResult.success) {
  //   throw new BadRequest({ message: '회원가입 인증 메일 전송 실패', error: sendMailResult.error });
  // }

  ctx.status = StatusCodes.OK;
  ctx.body = createdUser;
};

// # 로그인
export const login: Middleware = async ctx => {
  interface RequestBody {
    email: string;
    password: string;
  }
  const loginForm: RequestBody = ctx.request.body;

  const schema = generateSchema(loginForm);
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }
  const authService = new AuthService();
  const result = await authService.login(loginForm);
  if (!result.success) {
    throw new BadRequest(result.error);
  }
  ctx.status = StatusCodes.OK;
  ctx.body = result.data;
};

// # 프로필 수정
export const editProfile: Middleware = async ctx => {
  interface RequestBody {
    displayName?: string;
    about?: string;
    thumbnail?: string;
  }
  const profileForm: RequestBody = ctx.request.body;

  const schema = generateSchema(profileForm);
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const authService = new AuthService();
  const pfofileEditResult = await authService.editPforile(ctx.state.user.profile._id, profileForm);
  if (!pfofileEditResult.success) {
    throw new BadRequest(pfofileEditResult.error);
  }
  const userResult = await authService.findUsersByOptions(ctx.state.user.id);
  if (!userResult.success) {
    throw new BadRequest(userResult.error);
  }
  ctx.status = StatusCodes.OK;
  ctx.body = userResult.data;
};

// # 리프레쉬
export const refresh: Middleware = async ctx => {
  const { refreshToken }: { refreshToken: string } = ctx.request.body;

  const schema = generateSchema({ refreshToken });
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const { _id: userId }: { _id: string } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
  const authService = new AuthService();
  const result = await authService.refresh(userId);
  if (!result.success) throw new Unauthorized(result.error);

  ctx.status = StatusCodes.OK;
  ctx.body = result.data;
};

// # 이메일 인증
export const emailConfirmation: Middleware = async ctx => {
  const { emailAuthToken }: { emailAuthToken: string } = ctx.request.body;

  const schema = generateSchema({ emailAuthToken });
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }

  // 이메일 링크 인증
  const authService = new AuthService();
  const emailAuthResult = await authService.emailAuthentication(emailAuthToken, 'register');
  if (!emailAuthResult.success) {
    if (emailAuthResult.error?.error === 404) throw new NotFound(emailAuthResult.error.message);
    else throw new BadRequest(emailAuthResult.error);
  }
  // 유저 인증
  if (!emailAuthResult.data) throw new BadRequest('이메일 인증 정보가 존재하지 않습니다.');
  const userConfirmResult = await authService.userConfirmation(emailAuthResult.data);
  if (!userConfirmResult.success) throw new BadRequest(userConfirmResult.error);
  ctx.status = StatusCodes.OK;
  ctx.body = 'User Confirmed!!';
};

// # 중복 확인
export const duplicateCheck: Middleware = async ctx => {
  const data: { email?: string; username?: string } = ctx.request.query;
  console.log(data);
  const schema = generateSchema(data);
  if (!validateSchema(ctx, schema, 'query')) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }
  const authService = new AuthService();
  const result = await authService.findUsersByOptions({ where: { ...data } });
  if (result.success) {
    throw new Conflict({ message: '존재하는 사용자입니다.', error: { query: data } });
  }
  ctx.status = StatusCodes.OK;
  ctx.body = { mesage: `사용 가능한 ${Object.keys(data).join(', ')} 입니다.` };
};

// # 테스트
export const test: Middleware = async ctx => {
  const authService = new AuthService();

  const user = await authService.test(ctx.state.user._id);

  ctx.status = StatusCodes.OK;
  // ctx.body = user;
};
