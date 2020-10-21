import { Middleware } from 'koa';
import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET } from '../constans/secrets';
import User from '../entity/User';
import { Unauthorized, Forbidden } from '../errors/errRequest';

export const hydrateUser: Middleware = async (ctx, next) => {
  if (!ctx.request.headers.authorization) return next();

  const accessToken = (ctx.headers.authorization as string).split(' ')[1];

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;
    if (typeof decoded === 'string') return next();
    ctx.state.user = (await User.findOneByUUID(decoded._id)) ?? undefined;
    console.log('decoded: ', decoded);
    return next();
  } catch (error) {
    return next();
  }
};

export const checkLoggedIn: Middleware = async (ctx, next) => {
  if (!ctx.state.user)
    throw new Unauthorized({ message: '로그인이 필요합니다', error: '권한 없는 접근' });
  return next();
};

export const checkLoggedOut: Middleware = async (ctx, next) => {
  if (ctx.state.user)
    throw new Forbidden({ message: '잘못 된 접근입니다.', error: '권한 없는 접근' });
  return next();
};
