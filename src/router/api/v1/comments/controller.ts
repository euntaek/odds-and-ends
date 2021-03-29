import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import { generateSchemaAndValue, validateSchema } from '@/utils/reqValidation';
import { BadRequest } from '@/errors/errRequest';
import CommentService from '@/services/CommentService';

/**
 * 댓글 전체 조회
 * GET /api/v1/comments
 */
export const list: Middleware = async ctx => {
  interface RequestQuery {
    'post-id': string;
    'p-id'?: string;
    'ref-comment': string;
  }
  const requestQuery: RequestQuery = ctx.request.query;
  const { 'post-id': postId, 'p-id': pId, 'ref-comment': refCommentId } = requestQuery;

  const schemaAndValue = generateSchemaAndValue({ postId, pId, refCommentId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }

  const commentService = new CommentService();
  const listResult = await commentService.getAllComment(postId, pId, refCommentId);
  if (!listResult.success) {
    return ctx.throw(new BadRequest(listResult.error));
  }
  ctx.status = StatusCodes.OK;
  ctx.body = listResult.data;
};

/**
 * 댓글 작성
 * POST /api/v1/comments
 */
export const write: Middleware = async ctx => {
  interface RequestBody {
    postId: string;
    content: string;
    refCommentId?: string;
    replyToId?: string;
  }
  const writeForm: RequestBody = ctx.request.body;
  const { postId, content, refCommentId, replyToId } = writeForm;
  const schemaAndValue = generateSchemaAndValue({ postId, content, refCommentId, replyToId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }
  const commentService = new CommentService();
  const writeResult = await commentService.createOneComment(ctx.state.user, {
    postId,
    content,
    refCommentId,
    replyToId,
  });
  if (!writeResult.success) {
    return ctx.throw(new BadRequest(writeResult.error));
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

/**
 * 댓글 수정
 * PATCH /api/v1/comments/:id
 * TODO: 댓글 수정 아직 안함. 나중에 프론트 좀 하고 하자.
 */
export const update: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = 'OK';
};

/**
 * 댓글 삭제
 * DELETE /api/v1/comments/:id
 */
export const remove: Middleware = async ctx => {
  const { id: commentId }: { id: string } = ctx.params;
  const schemaAndValue = generateSchemaAndValue({ commentId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    return ctx.throw(new BadRequest(ctx.state.error));
  }
  const commentService = new CommentService();
  const removeResult = await commentService.removeOneComment(ctx.state.user, commentId);
  if (!removeResult.success) {
    return ctx.throw(new BadRequest(removeResult.error));
  }
  ctx.status = StatusCodes.NO_CONTENT;
};
