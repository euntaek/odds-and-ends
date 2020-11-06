import { Middleware } from '@koa/router';
import multer from '@koa/multer';

import { s3Storage } from '../utils/s3';

const limits = { fileSize: 4 * 1024 * 1024 }; // 4MB

export function upload(fieldName: string): Middleware {
  return async (ctx, next) => {
    const { username } = ctx.state.user;
    await multer({ storage: s3Storage(fieldName, username) as any, limits }).array(fieldName)(
      ctx as any,
      next,
    );
  };
}
