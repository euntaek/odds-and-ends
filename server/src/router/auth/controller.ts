import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

import { BadRequest } from '../../errors/errRequest';
import { validateJoi } from '../../lib/utils';
import AuthService from '../../services/AuthService';

export const register: Middleware = async (ctx) => {
  interface RequestBody {
    email: string;
    displayName: string;
    password: string;
  }
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    displayName: Joi.string().min(3).max(8).required(),
    password: Joi.string().min(6).max(24).required(),
  });
  if (!validateJoi(ctx, schema, 'body')) {
    throw new BadRequest({ message: 'shcema 오류', log: ctx.state.error });
  }

  const userData: RequestBody = ctx.request.body;
  const createdUser = await AuthService.createOneUser(userData);

  ctx.status = StatusCodes.OK;
  ctx.body = createdUser;
};

export const login: Middleware = async (ctx) => {
  ctx.status = StatusCodes.OK;
};
export const check: Middleware = async (ctx) => {
  ctx.status = StatusCodes.OK;
};
export const logout: Middleware = async (ctx) => {
  ctx.status = StatusCodes.OK;
};

export const usernameVerification: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string().min(3),
  });
  if (!validateJoi(ctx, schema, 'params')) {
    throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
  }

  const username: { username: string } = ctx.params;
  // const result = await AuthService.findOneUser()
  ctx.body = username;
};
