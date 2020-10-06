import { Middleware } from '@koa/router';
import { ObjectID } from 'mongodb';

import { BadRequest } from '../../errors/errRequest';

export const checkObjectId: Middleware = (ctx, next) => {
  const { id }: { id: string } = ctx.params;
  if (!ObjectID.isValid(id)) {
    throw new BadRequest({ message: '아이디 타입 오류', location: 'middleware.checkObjectid' });
  }
  return next();
};
