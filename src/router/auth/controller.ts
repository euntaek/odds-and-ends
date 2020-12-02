import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import User from '../../entity/User';
import AuthService from '../../services/AuthService';

import { REFRESH_TOKEN_SECRET } from '../../constans';
import { generateSchemaAndValue, validateSchema } from '../../utils/reqValidation';
import { BadRequest, Conflict, Forbidden, NotFound, Unauthorized } from '../../errors/errRequest';

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

  const schemaAndValue = generateSchemaAndValue(userForm);
  if (!validateSchema(ctx, ...schemaAndValue)) {
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

  const schemaAndValue = generateSchemaAndValue(loginForm);
  if (!validateSchema(ctx, ...schemaAndValue)) {
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

// # 리프레쉬
export const refresh: Middleware = async ctx => {
  const { refreshToken }: { refreshToken: string } = ctx.request.body;

  const schemaAndValue = generateSchemaAndValue({ refreshToken });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const { id: userId }: { id: string } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
  const authService = new AuthService();
  const result = await authService.refresh(userId);
  if (!result.success) throw new Unauthorized(result.error);

  ctx.status = StatusCodes.OK;
  ctx.body = result.data;
};

// # 이메일 인증
export const emailConfirmation: Middleware = async ctx => {
  const { emailAuthToken }: { emailAuthToken: string } = ctx.request.body;

  const schemaAndValue = generateSchemaAndValue({ emailAuthToken });
  if (!validateSchema(ctx, ...schemaAndValue)) {
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

// # 사용자 체크
export const check: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = ctx.state.user;
};

// # 로그인 상태 체크
export const checkLoggedIn: Middleware = async (ctx, next) => {
  const user: User = ctx.state.user;
  if (!user) {
    throw new Unauthorized({ message: '로그인이 필요합니다', error: '권한 없는 접근' });
  }
  if (!user.isConfirmed) {
    throw new Forbidden({ message: '인증 되지 않은 사용자입니다.', error: '권한 없는 접근' });
  }
  return next();
};

// # 로그아웃 상태 체크
export const checkLoggedOut: Middleware = async (ctx, next) => {
  if (ctx.state.user) {
    throw new Forbidden({ message: '잘못 된 접근입니다.', error: '권한 없는 접근' });
  }
  return next();
};

// # 테스트
export const test: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  // ctx.body = user;
};
