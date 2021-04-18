import { Middleware } from '@koa/router';
import multer from '@koa/multer';

import { s3Storage } from '@/utils/s3';
import { InternalServerError } from '@/errors/errRequest';

const limits = { fileSize: 4 * 1024 * 1024 }; // 4MB

export function upload(fieldName: string, type: 'single' | 'array'): Middleware {
  return async (ctx, next) => {
    try {
      const { id } = ctx.state.user;
      const multerInstance = multer({ storage: s3Storage(id, fieldName) as any, limits })[type];
      // 이미지 업로드
      await multerInstance(fieldName)(ctx as any, next);
    } catch (error) {
      ctx.throw(new InternalServerError({ ...error, name: 'AWS_S3_UPLOAD_ERROR' }));
    }
  };
}
