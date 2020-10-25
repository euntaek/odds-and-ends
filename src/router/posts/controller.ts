import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import PostService from '../../services/PostService';

import { generateSchema, validateSchema } from '../../utils/reqValidation';
import { BadRequest, NotFound } from '../../errors/errRequest';

// # 게시물 전체 조회
export const list: Middleware = async ctx => {
  const postService = new PostService();
  const result = await postService.getAllPost();

  ctx.status = StatusCodes.OK;
  ctx.body = result.data;
};

// # 게시물 조회
export const read: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
};

// # 게시물 작성
export const write: Middleware = ctx => {
  interface RequestBody {
    body: string;
    tags: string[];
    images: string[];
  }
  const writeForm: RequestBody = ctx.request.body;
  console.log(writeForm);
  const schema = generateSchema(writeForm);
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }
  ctx.status = StatusCodes.OK;
};

// # 게시물 삭제
export const remove: Middleware = ctx => {
  ctx.status = StatusCodes.OK;
};

// # 게시물 수정
export const update: Middleware = ctx => {
  ctx.status = StatusCodes.OK;
};

//# 이미지 업로드
export const uploadImages: Middleware = async ctx => {
  console.log(ctx.request.files);
  ctx.status = StatusCodes.OK;
  ctx.body = { files: ctx.request.files };
};
