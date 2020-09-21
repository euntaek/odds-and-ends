import { Middleware } from '@koa/router';
import { ObjectID } from 'mongodb';

import { BadRequest } from '../../errors/errRequest';

export const checkObjectId: Middleware = (ctx, next) => {
  console.log('chch1');
  const { id }: { id: string } = ctx.params;
  if (!ObjectID.isValid(id)) {
    throw new BadRequest({
      location: 'middelwares/chekObjectId',
      error: 'id가 objectId 타입이 아님',
      log: ctx.params,
    });
  }
  return next();
};

export const checkObjectIds: Middleware = (ctx, next) => {
  const { checked }: { checked: string[] } = ctx.request.body;
  console.log(Array.isArray(checked), checked);
  if (!checked.length) throw new BadRequest({ error: '값이 없음' });
  for (const id of checked) {
    if (!ObjectID.isValid(id)) {
      throw new BadRequest({
        location: 'middelwares/chekObjectIds',
        error: 'id가 objectId 타입이 아님',
        log: { id },
      });
    }
  }

  return next();
};
