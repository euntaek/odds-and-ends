import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import joiObjectId from 'joi-objectid';

import { BadRequest, NotFound } from '../../errors/errRequest';
import { validateJoi } from '../../lib/utils';
import { refindPosts } from '../../lib/posts';
import PostService from '../../services/PostService';

const JoiObjectId = joiObjectId(Joi);

interface RequestBody {
  title: string;
  body: string;
  tags: string[];
}

export const write: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    deletedDate: Joi.date().allow(null),
  });
  if (!validateJoi(ctx, schema, 'body')) {
    throw new BadRequest({ message: 'shcema 오류', log: ctx.state.error });
  }

  const postBody: RequestBody = ctx.request.body;
  const post = await PostService.createOnePost(postBody);

  ctx.status = StatusCodes.CREATED;
  ctx.body = post;
};

export const list: Middleware = async (ctx) => {
  const page = parseInt(ctx.query.page || '1', 10);

  const [posts, postCount] = await PostService.getAllPost(page);
  const refinedPosts = refindPosts(posts);
  const lastPage = Math.ceil(postCount / 15).toString();

  ctx.set('Last-Page', lastPage);
  ctx.status = StatusCodes.OK;
  ctx.body = [refinedPosts, postCount];
};

export const read: Middleware = async (ctx) => {
  const { id }: { id: string } = ctx.params;
  const post = await PostService.getOnePost(id);
  if (!post) throw new NotFound({ message: '존재하지 않는 게시물' });

  ctx.status = StatusCodes.OK;
  ctx.body = post;
};

export const remove: Middleware = async (ctx) => {
  const { id }: { id: string } = ctx.params;
  const result = await PostService.removeOnePost(id);
  if (!result) throw new BadRequest({ message: '게시물 삭제 실패', log: 'Not found targetPost' });

  ctx.status = StatusCodes.NO_CONTENT;
};

export const removeMany: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    checked: Joi.array().items(JoiObjectId()).required(),
  });
  if (!validateJoi(ctx, schema, 'body')) {
    throw new BadRequest({ message: 'shcema 오류', log: ctx.state.error });
  }

  const { checked: ids }: { checked: string[] } = ctx.request.body;
  const result = await PostService.removeManyPost(ids);
  if (!result) throw new BadRequest({ message: '게시물 삭제 실패', log: 'Not found targetPosts' });

  ctx.status = StatusCodes.NO_CONTENT;
};

export const update: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });
  if (!validateJoi(ctx, schema, 'body')) {
    throw new BadRequest({ message: 'shcema 오류', log: ctx.state.error });
  }

  const { id }: { id: string } = ctx.params;
  const postBody = ctx.request.body as RequestBody;
  const result = await PostService.updateOnePost(id, postBody);
  if (!result) throw new BadRequest({ message: '게시물 수정 실패', log: 'Not found targetPost' });

  ctx.status = StatusCodes.NO_CONTENT;
};
