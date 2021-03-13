import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import { generateSchemaAndValue, validateSchema } from '../../utils/reqValidation';
import { BadRequest } from '../../errors/errRequest';
import CommentService from '../../services/CommentService';

export const list: Middleware = async ctx => {
  const {
    'post-id': postId,
    'p-id': pId,
    'ref-comment': refCommentId,
  }: { 'post-id': string; 'p-id'?: string; 'ref-comment': string } = ctx.request.query;

  const schemaAndValue = generateSchemaAndValue({ postId, pId, refCommentId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }

  const commentService = new CommentService();
  const listResult = await commentService.getAllComment(postId, pId, refCommentId);
  if (!listResult.success) {
    throw new BadRequest('댓글 조회 실패');
  }
  ctx.status = StatusCodes.OK;
  ctx.body = listResult.data;
};

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
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }
  const commentService = new CommentService();
  const writeResult = await commentService.createOneComment(ctx.state.user, {
    postId,
    content,
    refCommentId,
    replyToId,
  });
  if (!writeResult.success) {
    throw new BadRequest(writeResult.error);
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

export const update: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = 'OK';
};

export const remove: Middleware = async ctx => {
  const { id: commentId }: { id: string } = ctx.params;
  const schemaAndValue = generateSchemaAndValue({ commentId });
  if (!validateSchema(ctx, ...schemaAndValue)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }
  const commentService = new CommentService();
  const removeResult = await commentService.removeOneComment(ctx.state.user, commentId);
  if (!removeResult.success) {
    throw new BadRequest(removeResult.error);
  }
  ctx.status = StatusCodes.OK;
};

export const test: Middleware = async ctx => {
  const commentService = new CommentService();
  const data = await commentService.test();

  ctx.status = StatusCodes.OK;
  ctx.body = data;
};
