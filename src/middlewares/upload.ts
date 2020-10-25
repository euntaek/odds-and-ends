import { Middleware } from '@koa/router';

import { multerInstance } from '../utils/multer';

export function upload(filename: string): Middleware {
  return async (ctx, next) => {
    await multerInstance.array(filename)(ctx as any, next);
  };
}
