import Koa from 'koa';
import { Middleware } from '@koa/router';
import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET } from '@/constans/secrets';
import { User } from '@/entity';
import { Unauthorized, Forbidden } from '@/errors/errRequest';

export const hydrateUser: Koa.Middleware = async (ctx, next) => {
  if (!ctx.request.headers.authorization) return next();

  const accessToken = (ctx.headers.authorization as string).split(' ')[1];

  try {
    console.log('\x1b[32m%s\x1b[0m', 'start--------------hydrate user--------------');
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;
    if (typeof decoded === 'string') return next();
    ctx.state.user = (await User.findOneByKeyValue('id', decoded.id)) ?? undefined;
    console.log('\x1b[32m%s\x1b[0m', 'end----------------hydrate user--------------');
    return next();
  } catch (error) {
    return next();
  }
};

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

export const checkLoggedOut: Middleware = async (ctx, next) => {
  if (ctx.state.user) {
    throw new Forbidden({ message: '잘못 된 접근입니다.', error: '권한 없는 접근' });
  }
  return next();
};
