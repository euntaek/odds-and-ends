import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import PostService from '../../services/PostService';

import { generateSchema, validateSchema } from '../../utils/reqValidation';
import { BadRequest, NotFound } from '../../errors/errRequest';

// # 게시물 전체 조회
export const list: Middleware = async ctx => {
  const postService = new PostService();
  const listResult = await postService.getAllPost();
  if (!listResult.success) {
    throw new BadRequest(listResult.error);
  }
  ctx.status = StatusCodes.OK;
  ctx.body = listResult.data;
};

// # 게시물 조회
export const read: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
};

// # 게시물 작성
export const write: Middleware = async ctx => {
  interface RequestBody {
    content: string;
    tags: string[];
    images: string[];
  }
  const writeForm: RequestBody = ctx.request.body;

  const schema = generateSchema(writeForm);
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const postService = new PostService();
  const resultWrite = await postService.write(ctx.state.user, writeForm);
  if (!resultWrite.success || !resultWrite.data) {
    throw new BadRequest('게시물 작성 실패');
  }
  ctx.status = StatusCodes.OK;
  ctx.body = resultWrite.data;
};

// # 게시물 삭제
export const remove: Middleware = async ctx => {
  const { id: postId }: { id: string } = ctx.params;

  const schema = generateSchema({ id: postId });
  if (!validateSchema(ctx, schema, 'params')) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const postService = new PostService();
  const removeResult = await postService.removeOnePost(postId, ctx.state.user.id);
  if (!removeResult.success) {
    throw new BadRequest(removeResult.error);
  }
  ctx.status = StatusCodes.OK;
};

// # 게시물 수정
export const update: Middleware = ctx => {
  ctx.status = StatusCodes.OK;
};

//# 이미지 업로드
export const uploadImages: Middleware = async ctx => {
  // console.log(ctx.request.files);
  ctx.status = StatusCodes.OK;
  ctx.body = { files: ctx.request.files };
};

export const test: Middleware = async ctx => {
  const postService = new PostService();
  const data = await postService.test();
  ctx.status = StatusCodes.OK;
};
