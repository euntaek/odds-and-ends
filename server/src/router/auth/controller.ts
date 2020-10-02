import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

import AuthService from '../../services/AuthService';
import sendMail from '../../lib/sendMail';
import { BadRequest } from '../../errors/errRequest';
import { validateJoi } from '../../lib/utils';
import { generateToken } from '../../lib/auth';
import { createEmailTemplate } from '../../etc/emailTemplates';

export const register: Middleware = async (ctx) => {
  interface RequestBody {
    email: string;
    displayName: string;
    password: string;
  }
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    displayName: Joi.string()
      .regex(/^[a-z0-9-_]+$/)
      .min(3)
      .max(16)
      .required(),
    password: Joi.string().min(6).max(24).required(),
  });
  if (!validateJoi(ctx, schema, 'body')) {
    throw new BadRequest({ message: 'shcema 오류', log: ctx.state.error });
  }

  const userData: RequestBody = ctx.request.body;
  const user = await AuthService.createOneUser(userData);
  if (!user) throw new BadRequest({ message: '회원가입 실패' });
  const authToken = generateToken();
  const emailAuth = await AuthService.createOneEmailAuth('register', user.email, authToken);
  if (!emailAuth) throw new BadRequest({ message: '이메일 인증 생성 실패' });
  const emailTemplate = createEmailTemplate('register', user.displayName as string, authToken);
  const result = await sendMail(ctx, { to: user.email, ...emailTemplate });
  if (!result) {
    throw new BadRequest({ message: '회원가입 인증 메일 전송 실패', log: ctx.state.error });
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

export const login: Middleware = async (ctx) => {
  ctx.status = StatusCodes.OK;
};
export const check: Middleware = async (ctx) => {
  // AuthService.sendEmail('register', 'email');
  ctx.status = StatusCodes.OK;
};
export const logout: Middleware = async (ctx) => {
  ctx.status = StatusCodes.OK;
};
export const emailVerification: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });
  if (!validateJoi(ctx, schema, 'params')) {
    throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
  }

  const { email }: { email: string } = ctx.params;
  const result = await AuthService.findOneEmail(email);
  ctx.status = StatusCodes.OK;
  ctx.body = result
    ? { result, message: '이미 사용 중인 이메일입니다.' }
    : { result, message: '사용 가능한 이메일입니다.' };
};
export const displayNameVerification: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    displayName: Joi.string()
      .regex(/^[a-z0-9-_]+$/)
      .min(3)
      .max(16)
      .required(),
  });
  if (!validateJoi(ctx, schema, 'params')) {
    throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
  }

  const { displayName }: { displayName: string } = ctx.params;
  const result = await AuthService.findOneDisplayName(displayName);
  ctx.status = StatusCodes.OK;
  ctx.body = result
    ? { result, message: '이미 사용 중인 닉네임입니다.' }
    : { result, message: '사용 가능한 닉네임입니다.' };
};

export const emailConfirmation: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    token: Joi.string().hex().min(32),
  });
  if (!validateJoi(ctx, schema, 'body')) {
    throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
  }

  const { token }: { token: string } = ctx.request.body;
  const emailAuth = await AuthService.getOneEmailAuth(token);
  if (!emailAuth) throw new BadRequest({ message: '만료 된 토큰' });
  if (emailAuth.type !== 'register') throw new BadRequest({ message: '잘못 된 토큰' });
  if (emailAuth.isVerified) throw new BadRequest({ message: '이미 사용 된 토큰' });
  const result = await AuthService.userCertification(emailAuth.email);
  emailAuth.isVerified = true;
  await emailAuth.save();
  if (result.error) throw new BadRequest(result.error);
  ctx.status = StatusCodes.OK;
  ctx.body = { messgae: '인증 성공' };
};
