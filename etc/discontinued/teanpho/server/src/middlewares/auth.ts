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
    ctx.state.user = (await User.findOneByKeyValue('id', decoded.id, 'soft')) ?? undefined;
    console.log('\x1b[32m%s\x1b[0m', 'end----------------hydrate user--------------');
    return next();
  } catch (error) {
    return next();
  }
};

export const checkLoggedIn: Middleware = async (ctx, next) => {
  const user: User = ctx.state.user;
  if (!user) {
    return ctx.throw(
      new Unauthorized({
        name: 'CHECK_LOGGED_IN_FAILURE',
        message: '로그인 후 이용 가능합니다.',
      }),
    );
  }
  if (!user.isConfirmed) {
    return ctx.throw(
      new Forbidden({
        name: 'CHECK_LOGGED_IN_FAILURE',
        message: '이메일 인증이 되지 않은 사용자입니다.',
      }),
    );
  }
  return next();
};

// # 로그아웃 상태 체크
export const checkLoggedOut: Middleware = async (ctx, next) => {
  if (ctx.state.user) {
    return ctx.throw(
      new Unauthorized({
        name: 'CHECK_LOGGED_OUT_FAILURE',
        message: '로그인 상태로 이용 불가능합니다.',
      }),
    );
  }
  return next();
};
