import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import PostService from '@/services/PostService';

import { generateSchemaAndValue, validateSchema } from '@/utils/reqValidation';
import { BadRequest } from '@/errors/errRequest';

// # 게시물 전체 조회
export const list: Middleware = async ctx => {
  const { 'p-id': pId, tag }: { 'p-id'?: string; tag?: string } = ctx.request.query;

  const schemaAndValue = generateSchemaAndValue({ pId, tag });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }

  const postService = new PostService();
  const listResult = await postService.getAllPost(ctx.state.user, tag, pId);
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

  const schemaAndValue = generateSchemaAndValue(writeForm);
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const postService = new PostService();
  const writeResult = await postService.createOnePost(ctx.state.user, writeForm);
  if (!writeResult.success || !writeResult.data) {
    throw new BadRequest('게시물 작성 실패');
  }
  ctx.status = StatusCodes.OK;
  ctx.body = writeResult.data;
};

// # 게시물 삭제
export const remove: Middleware = async ctx => {
  const { id: postId }: { id: string } = ctx.params;

  const schemaAndValue = generateSchemaAndValue({ postId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  const postService = new PostService();
  const removeResult = await postService.removeOnePost(ctx.state.user, postId);
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
  ctx.body = data;
};
