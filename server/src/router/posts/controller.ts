import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import joiObjectId from 'joi-objectid';

import { BadRequest, NotFound } from '../../errors/errRequest';
import { validateBody } from '../../lib/utils';
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
  });
  if (!validateBody(ctx, schema)) {
    throw new BadRequest({ message: ' shcema 오류', log: ctx.state.error });
  }
  const postBody = ctx.request.body as RequestBody;
  const postService = new PostService();
  const post = await postService.createOnePost(postBody);
  ctx.status = StatusCodes.CREATED;
  ctx.body = post;
};

export const list: Middleware = async (ctx) => {
  const postService = new PostService();
  const [posts, postCount] = await postService.getAllPost();
  const refinedPosts = posts.map((post) => ({
    ...post,
    body: post.body.length < 100 ? post.body : `${post.body.slice(0, 100)}...`,
  }));
  const lastPage = Math.ceil(postCount / 10).toString();
  ctx.set('Last-Page', lastPage);
  ctx.status = StatusCodes.OK;
  ctx.body = refinedPosts;
};

export const read: Middleware = async (ctx) => {
  const { id }: { id: string } = ctx.params;
  const postService = new PostService();
  const post = await postService.getOnePost(id);
  if (!post) throw new NotFound({ message: '존재하지 않는 게시물' });
  ctx.status = StatusCodes.OK;
  ctx.body = post;
};

export const remove: Middleware = async (ctx) => {
  const { id }: { id: string } = ctx.params;
  const postService = new PostService();
  const result = await postService.removeOnePost(id);
  if (!result.ok || !result.value) {
    throw new BadRequest({ message: '게시물 삭제 실패' });
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

export const removeMany: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    checked: Joi.array().items(JoiObjectId()).required(),
  });
  if (!validateBody(ctx, schema)) {
    throw new BadRequest();
  }
  const { checked: ids }: { checked: string[] } = ctx.request.body;
  const postService = new PostService();
  const result = await postService.removeManyPost(ids);
  console.log(ids.length === result.n, ids.length, ' ', result.n);
  if (result.ok && result.n === ids.length) {
    ctx.status = StatusCodes.NO_CONTENT;
  } else {
    throw new BadRequest({ message: '선택 된 게시물 삭제 실패 또는 부분 삭제' });
  }
};

export const update: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });
  if (!validateBody(ctx, schema)) {
    throw new BadRequest();
  }
  const { id }: { id: string } = ctx.params;
  const postBody = ctx.request.body as RequestBody;
  const postService = new PostService();
  const result = await postService.updateOnePost(id, postBody);
  if (!result.ok || !result.value) {
    throw new BadRequest({ message: '게시물 수정 실패' });
  }
  ctx.status = StatusCodes.NO_CONTENT;
};
