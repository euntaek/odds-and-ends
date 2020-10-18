import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import AuthService from '../../services/AuthService';

import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  Unauthorized,
} from '../../errors/errRequest';
import { generateSchema, validateSchema } from '../../lib/reqValidation';
import { generateToken, setTokenCookie } from '../../lib/auth';

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

//   const isValidPassword = await user.checkPassword(password);
//   if (!isValidPassword) {
//     throw new Unauthorized({ message: '입력하신 이메일 주소 혹은 비밀번호를 다시 확인해주세요' });
//   }

//   const token = await user.generateUserToken();
//   setTokenCookie(ctx, token);

//   ctx.status = StatusCodes.OK;
//   ctx.body = { message: '로그인 성공' };
// };

// export const check: Middleware = async (ctx) => {
//   const { user } = ctx.state;
//   if (!user) throw new Unauthorized({ message: '로그인 중이 아닙니다.' });
//   ctx.status = StatusCodes.OK;
//   ctx.body = user;
// };

// export const logout: Middleware = async (ctx) => {
//   ctx.cookies.set('access_token');
//   ctx.status = StatusCodes.NO_CONTENT;
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

// export const displayNameVerification: Middleware = async (ctx) => {
//   const schema = Joi.object().keys({ displayName: validation.displayName });
//   if (!validateJoi(ctx, schema, 'params')) {
//     throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
//   }

//   const { displayName }: { displayName: string } = ctx.params;

//   const result = await AuthService.findOneDisplayName(displayName);
//   if (result) throw new Conflict({ message: '이미 사용 중인 닉네임입니다.' });

//   ctx.status = StatusCodes.OK;
//   ctx.body = { message: '사용 가능한 닉네임입니다.' };
// };

export const emailConfirmation: Middleware = async ctx => {
  const { emailAuthToken }: { emailAuthToken: string } = ctx.params;
  const schema = generateSchema({ emailAuthToken });
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }
};

export const test: Middleware = async ctx => {
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

//   const { token }: { token: string } = ctx.request.body;

//   const emailAuth = await AuthService.getOneEmailAuth(token);
//   if (!emailAuth) throw new BadRequest({ message: '만료 된 토큰' });
//   if (emailAuth.type !== 'register') throw new BadRequest({ message: '잘못 된 토큰' });
//   if (emailAuth.isVerified) throw new BadRequest({ message: '이미 사용 된 토큰' });

//   const result = await AuthService.userCertification(emailAuth.email);
//   if (!result) throw new BadRequest({ message: '이메일 인증에 실패했습니다.' });

//   emailAuth.isVerified = true;
//   await emailAuth.save();

//   ctx.status = StatusCodes.OK;
//   ctx.body = { messgae: '이메일 인증 완료' };
// };
