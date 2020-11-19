import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import { generateSchema, validateSchema } from '../../utils/reqValidation';
import { BadRequest } from '../../errors/errRequest';
import CommentService from '../../services/CommentService';

export const list: Middleware = async ctx => {
  const query: { 'post-id': string; 'p-id'?: string; 'ref-comment': string } = ctx.request.query;

  const schema = generateSchema(query);
  if (!validateSchema(ctx, schema, 'query')) {
    throw new BadRequest({ message: ' shcema 오류', error: ctx.state.error });
  }

  const { 'post-id': postId, 'p-id': pId, 'ref-comment': refComment } = query;
  const commentService = new CommentService();
  const listResult = await commentService.list(postId, pId, refComment);
  if (!listResult.success) {
    throw new BadRequest('댓글 조회 실패');
  }
  ctx.status = StatusCodes.OK;
  ctx.body = listResult.data;
};

export const write: Middleware = async ctx => {
  interface RequestBody {
    id: string;
    content: string;
    refComment: string;
  }
  const writeForm: RequestBody = ctx.request.body;

  const schema = generateSchema(writeForm);
  if (!validateSchema(ctx, schema)) {
    throw new BadRequest({ message: 'shcema 오류', error: ctx.state.error });
  }

  ctx.status = StatusCodes.OK;
  ctx.body = 'OK';
};

export const update: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = 'OK';
};

export const remove: Middleware = async ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = 'OK';
};

export const test: Middleware = async ctx => {
  const commentService = new CommentService();
  const data = await commentService.test();

  ctx.status = StatusCodes.OK;
  ctx.body = data;
};
