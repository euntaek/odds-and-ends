import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { User } from '@/entity';
import AuthService from '@/services/AuthService';
import UserService from '@/services/UserService';

import { REFRESH_TOKEN_SECRET } from '@/constans';
import { generateSchemaAndValue, validateSchema } from '@/utils/reqValidation';
import { BadRequest, Conflict, Unauthorized } from '@/errors/errRequest';

/**
 * 회원가입
 * POST /api/v1/auth/register
 */
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
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  const authService = new AuthService();
  const registerResult = await authService.register(userForm);

  if (!registerResult.success) {
    return ctx.throw(new Conflict(registerResult.error));
  }

  const createdUser = registerResult.data as User;

  // 회원가입 인증 이메일 전송
  const sendMailResult = await authService.sendMail('register', createdUser);

  if (!sendMailResult.success) {
    return ctx.throw(new BadRequest(sendMailResult.error));
  }

  ctx.status = StatusCodes.OK;
  ctx.body = createdUser;
};

/**
 * 로그인
 * POST /api/v1/auth/login
 */
export const login: Middleware = async ctx => {
  interface RequestBody {
    email: string;
    password: string;
  }
  const loginForm: RequestBody = ctx.request.body;

  const schemaAndValue = generateSchemaAndValue(loginForm);
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }
  const authService = new AuthService();
  const loginResult = await authService.login(loginForm);
  if (!loginResult.success) {
    return ctx.throw(new BadRequest(loginResult.error));
  }
  ctx.status = StatusCodes.OK;
  ctx.body = loginResult.data;
};

/**
 * 토큰 리프레쉬
 * POST /api/v1/auth/refresh
 */
export const refresh: Middleware = async ctx => {
  const { refreshToken }: { refreshToken: string } = ctx.request.body;

  const schemaAndValue = generateSchemaAndValue({ refreshToken });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  const { id: userId }: { id: string } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
  const authService = new AuthService();
  const reFreshResult = await authService.refresh(userId);
  if (!reFreshResult.success) {
    ctx.throw(new Unauthorized(reFreshResult.error));
  }

  ctx.status = StatusCodes.OK;
  ctx.body = reFreshResult.data;
};

/**
 * 이메일 인증
 * PATCH /api/v1/auth/email-confirmation
 */
export const emailConfirmation: Middleware = async ctx => {
  const { emailAuthToken }: { emailAuthToken: string } = ctx.request.body;

  const schemaAndValue = generateSchemaAndValue({ emailAuthToken });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  // 이메일 링크 인증
  const authService = new AuthService();
  const emailAuthResult = await authService.emailAuthentication(emailAuthToken, 'register');
  if (!emailAuthResult.success) {
    return ctx.throw(new BadRequest(emailAuthResult.error));
  }

  // 유저 확인
  if (!emailAuthResult.data) {
    return ctx.throw(new BadRequest('EMAIL_AUTHENTICATION_NOT_FOUND'));
  }
  const userConfirmResult = await authService.userConfirmation(emailAuthResult.data);
  if (!userConfirmResult.success) {
    ctx.throw(new BadRequest(userConfirmResult.error));
  }
  ctx.status = StatusCodes.OK;
  ctx.body = { isConfirmed: true };
};

/**
 * 사용자 확인
 * GET /api/v1/auth/check
 */
export const check: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = ctx.state.user;
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
