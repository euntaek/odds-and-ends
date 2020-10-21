import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import AuthService from '../../services/AuthService';

import { BadRequest, Conflict, NotFound, Unauthorized } from '../../errors/errRequest';
import { generateSchema, validateSchema } from '../../utils/reqValidation';
import { REFRESH_TOKEN_SECRET } from '../../constans';

// 회원가입
export const register: Middleware = async ctx => {
  interface RequestBody {
    email: string;
    password: string;
    username: string;
    displayName: string;
    thumbnail: string;
  }
  const userForm: RequestBody = ctx.request.body;

  const schema = generateSchema(userForm);
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const authService = new AuthService();
  const registerResult = await authService.register(userForm);

  if (!registerResult.success) {
    throw new Conflict(registerResult.error);
  }

  const createdUser = registerResult.data as UserInfo;

  // send emaill
  const sendMailResult = await authService.sendMail('register', createdUser);

  if (!sendMailResult.success) {
    throw new BadRequest({ message: '회원가입 인증 메일 전송 실패', error: sendMailResult.error });
  }

  ctx.status = StatusCodes.OK;
  ctx.body = createdUser;
};

// 로그인
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

// 리프레쉬
export const refresh: Middleware = async ctx => {
  const { refreshToken }: { refreshToken: string } = ctx.request.body;

  const schema = generateSchema({ refreshToken });
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  try {
    const { _id }: { _id: string } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
    const authService = new AuthService();
    const result = await authService.refresh(_id);
    if (!result.success) throw new Unauthorized(result.error);

    ctx.status = StatusCodes.OK;
    ctx.body = result.data;
  } catch (error) {
    throw new Unauthorized({ message: '리프레쉬 실패', error });
  }
};

// 이메일 인증
export const emailConfirmation: Middleware = async ctx => {
  const { emailAuthToken }: { emailAuthToken: string } = ctx.params;

  const schema = generateSchema({ emailAuthToken });
  if (!validateSchema(ctx, schema, 'params')) {
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

// 테스트
export const test: Middleware = async ctx => {
  if (!ctx.state.user) {
    ctx.status = StatusCodes.NOT_FOUND;
    return;
  }

  ctx.status = StatusCodes.OK;
  ctx.body = ctx.state.user;
};

// export const check: Middleware = async (ctx) => {
//   const { user } = ctx.state;
//   if (!user) throw new Unauthorized({ message: '로그인 중이 아닙니다.' });
//   ctx.status = StatusCodes.OK;
//   ctx.body = user;
// };

// export const emailVerification: Middleware = async (ctx) => {
//   const schema = Joi.object().keys({ email: validation.email });
//   if (!validateJoi(ctx, schema, 'params')) {
//     throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
//   }

//   const { email }: { email: string } = ctx.params;

//   const result = await AuthService.findOneEmail(email);
//   if (result) throw new Conflict({ message: '이미 사용 중인 이메일입니다.' });

//   ctx.status = StatusCodes.OK;
//   ctx.body = { message: '사용 가능한 이메일입니다.' };
// };
