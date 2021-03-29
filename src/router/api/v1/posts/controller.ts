import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import PostService from '@/services/PostService';

import { generateSchemaAndValue, validateSchema } from '@/utils/reqValidation';
import { BadRequest } from '@/errors/errRequest';

/**
 * 게시물 전체 조회
 * GET /api/v1/posts
 */
export const list: Middleware = async ctx => {
  const { 'p-id': pId, tag }: { 'p-id'?: string; tag?: string } = ctx.request.query;

  const schemaAndValue = generateSchemaAndValue({ pId, tag });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  const postService = new PostService();
  const listResult = await postService.getAllPosts(ctx.state.user, tag, pId);
  if (!listResult.success) {
    return ctx.throw(new BadRequest(listResult.error));
  }
  ctx.status = StatusCodes.OK;
  ctx.body = listResult.data;
};

/**
 * 게시물 조회
 * GET /api/v1/comments/:id
 * TODO:
 * 다음에 필요하면 만들자.
 * 인스타그램처럼 게시물 단일페이지 없이 쭉 보여줄 예정
 * 그래서 당장 필요하지는 않을 듯.
 * 근데 댓글 더보기를 어떻게 구현할지에 따라 고민 좀 해봐야할 듯.
 */
export const read: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
};

/**
 * 게시물 작성
 * POST /api/v1/posts
 */
export const write: Middleware = async ctx => {
  interface RequestBody {
    content: string;
    tags: string[];
    images: string[];
  }
  const writeForm: RequestBody = ctx.request.body;

  const schemaAndValue = generateSchemaAndValue(writeForm);
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  const postService = new PostService();
  const writeResult = await postService.createOnePost(ctx.state.user, writeForm);
  if (!writeResult.success) {
    return ctx.throw(new BadRequest(writeResult.error));
  }

  const createdPost = writeResult.data;
  ctx.status = StatusCodes.OK;
  ctx.body = createdPost;
};

/**
 * 게시물 삭제
 * DELETE /api/v1/posts/:id
 */
export const remove: Middleware = async ctx => {
  const { id: postId }: { id: string } = ctx.params;

  const schemaAndValue = generateSchemaAndValue({ postId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  const postService = new PostService();
  const removeResult = await postService.removeOnePost(ctx.state.user, postId);
  if (!removeResult.success) {
    return ctx.throw(new BadRequest(removeResult.error));
  }
  ctx.status = StatusCodes.OK;
};

/**
 * 게시물 수정
 * PATCH /api/v1/posts/:id
 * TODO:
 * 다음에 필요하면 만들자.
 * 트위터는 게시물 수정 못 하는데 나도 수정 못 하게 하는 게 좋을 듯
 * 이유는 아직 '좋아요'를 만들지 않았지만 '좋아요'기능을 만들 경우
 * 좋아요 많이 받은 게시물이 후에 광고 게시물로 변질될 수 있기 때문에?
 */
export const update: Middleware = ctx => {
  ctx.status = StatusCodes.OK;
};

/**
 * 이미지 업로드
 * POST /api/v1/posts/images
 */
export const uploadImages: Middleware = async ctx => {
  // console.log(ctx.request.files);
  ctx.status = StatusCodes.OK;
  ctx.body = { files: ctx.request.files };
};
