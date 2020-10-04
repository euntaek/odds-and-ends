import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

import AuthService from '../../services/AuthService';
import sendMail from '../../lib/sendMail';
import { BadRequest, Conflict, Unauthorized } from '../../errors/errRequest';
import { validateJoi } from '../../lib/utils';
import { createEmailTemplate } from '../../etc/emailTemplates';
import { setTokenCookie } from '../../lib/auth';

const validation = {
  email: Joi.string().email().required(),
  displayName: Joi.string()
    .pattern(/^[a-z0-9-_]+$/)
    .min(3)
    .max(16)
    .required(),
  password: Joi.string().min(6).max(24).required(),
  token: Joi.string().hex().min(32),
};

export const register: Middleware = async (ctx) => {
  interface RequestBody {
    email: string;
    displayName: string;
    password: string;
  }
  const schema = Joi.object().keys({
    email: validation.email,
    displayName: validation.displayName,
    password: validation.password,
  });
  if (!validateJoi(ctx, schema, 'body')) {
    throw new BadRequest({ message: 'shcema 오류', log: ctx.state.error });
  }

  const userData: RequestBody = ctx.request.body;

  const user = await AuthService.createOneUser(userData);
  const emailAuth = await AuthService.createOneEmailAuth('register', user.email);
  const emailTemplate = createEmailTemplate('register', user.displayName, emailAuth.token);

  const result = await sendMail({ to: user.email, ...emailTemplate });
  if (!result.success) {
    throw new BadRequest({ message: '회원가입 인증 메일 전송 실패', log: result.error });
  }

  ctx.status = StatusCodes.OK;
  ctx.body = { message: '' };
};

export const login: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    email: validation.email,
    password: validation.password,
  });
  if (!validateJoi(ctx, schema, 'body')) {
    throw new BadRequest({ message: 'shcema 오류', log: ctx.state.error });
  }

  const { email, password }: { email: string; password: string } = ctx.request.body;

  const user = await AuthService.getOneUser(email);
  if (!user) {
    throw new Unauthorized({ message: '입력하신 이메일 주소 혹은 비밀번호를 다시 확인해주세요' });
  }

  const isValidPassword = await user.checkPassword(password);
  if (!isValidPassword) {
    throw new Unauthorized({ message: '입력하신 이메일 주소 혹은 비밀번호를 다시 확인해주세요' });
  }

  const token = await user.generateUserToken();
  setTokenCookie(ctx, token);

  ctx.status = StatusCodes.OK;
  ctx.body = { message: '로그인 성공' };
};

export const check: Middleware = async (ctx) => {
  const { user } = ctx.state;
  if (!user) throw new Unauthorized({ message: '로그인 중이 아닙니다.' });
  ctx.status = StatusCodes.OK;
  ctx.body = user;
};

export const logout: Middleware = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = StatusCodes.NO_CONTENT;
};

export const emailVerification: Middleware = async (ctx) => {
  const schema = Joi.object().keys({ email: validation.email });
  if (!validateJoi(ctx, schema, 'params')) {
    throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
  }

  const { email }: { email: string } = ctx.params;

  const result = await AuthService.findOneEmail(email);
  if (result) throw new Conflict({ message: '이미 사용 중인 이메일입니다.' });

  ctx.status = StatusCodes.OK;
  ctx.body = { message: '사용 가능한 이메일입니다.' };
};

export const displayNameVerification: Middleware = async (ctx) => {
  const schema = Joi.object().keys({ displayName: validation.displayName });
  if (!validateJoi(ctx, schema, 'params')) {
    throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
  }

  const { displayName }: { displayName: string } = ctx.params;

  const result = await AuthService.findOneDisplayName(displayName);
  if (result) throw new Conflict({ message: '이미 사용 중인 닉네임입니다.' });

  ctx.status = StatusCodes.OK;
  ctx.body = { message: '사용 가능한 닉네임입니다.' };
};

export const emailConfirmation: Middleware = async (ctx) => {
  const schema = Joi.object().keys({ token: validation.token });
  if (!validateJoi(ctx, schema, 'body')) {
    throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
  }

  const { token }: { token: string } = ctx.request.body;

  const emailAuth = await AuthService.getOneEmailAuth(token);
  if (!emailAuth) throw new BadRequest({ message: '만료 된 토큰' });
  if (emailAuth.type !== 'register') throw new BadRequest({ message: '잘못 된 토큰' });
  if (emailAuth.isVerified) throw new BadRequest({ message: '이미 사용 된 토큰' });

  const result = await AuthService.userCertification(emailAuth.email);
  if (!result) throw new BadRequest({ message: '이메일 인증에 실패했습니다.' });

  emailAuth.isVerified = true;
  await emailAuth.save();

  ctx.status = StatusCodes.OK;
  ctx.body = { messgae: '이메일 인증 완료' };
};
