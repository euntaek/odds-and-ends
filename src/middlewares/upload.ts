import { Middleware } from '@koa/router';
import multer from '@koa/multer';

import { s3Storage } from '../utils/s3';

const limits = { fileSize: 4 * 1024 * 1024 }; // 4MB

export function upload(fieldName: string, type: 'single' | 'array'): Middleware {
  return async (ctx, next) => {
    const { _id } = ctx.state.user;
    await multer({ storage: s3Storage(_id, fieldName) as any, limits })[type](fieldName)(
      ctx as any,
      next,
    );
  };
}
