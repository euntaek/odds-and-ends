import { Middleware } from 'koa';
import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET } from '../constans/secrets';
import User from '../entity/User';

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
