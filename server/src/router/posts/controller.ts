import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import { BadRequest, NotFound } from '../../errors/errRequest';
import PostService from '../../services/PostService';

interface RequestBody {
  title: string;
  body: string;
  tags: string[];
}

export const write: Middleware = async (ctx) => {
  const postBody = ctx.request.body as RequestBody;
  const postService = new PostService();
  const post = await postService.createOnePost(postBody);
  ctx.status = StatusCodes.CREATED;
  ctx.body = post;
};

export const list: Middleware = async (ctx) => {
  const postService = new PostService();
  const posts = await postService.getAllPost();
  ctx.status = StatusCodes.OK;
  ctx.body = posts;
};

export const read: Middleware = async (ctx) => {
  const { id }: { id: string } = ctx.params;
  const postService = new PostService();
  const post = await postService.getOnePost(id);
  if (!post) throw new NotFound({ location: 'posts/ctrl.read', error: '없는 게시물' });
  ctx.status = StatusCodes.OK;
  ctx.body = post;
};

export const remove: Middleware = async (ctx) => {
  const { id }: { id: string } = ctx.params;
  const postService = new PostService();
  const result = await postService.removeOnePost(id);
  if (!result.ok || !result.value) {
    throw new BadRequest({ location: 'posts/ctrl.remove', error: '게시물 삭제 실패', log: result });
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

export const removeMany: Middleware = async (ctx) => {
  // dummy Ids
  const ids = ['5f663cccaf16ed14859b8ef7', '5f663f34adb1ac1526ee746d'];

  const postService = new PostService();
  const result = await postService.removeManyPost(ids);
  if (!result.ok || result.n !== ids.length) {
    throw new BadRequest({
      location: 'posts/ctrl.removeMany',
      error: '선택 된 게시물 삭제 실패 or 부분 삭제',
      log: result,
    });
  }
  ctx.status = StatusCodes.NO_CONTENT;
};

export const update: Middleware = async (ctx) => {
  const { id }: { id: string } = ctx.params;
  const postBody = ctx.request.body as RequestBody;
  const postService = new PostService();
  const result = await postService.updateOnePost(id, postBody);
  if (!result.ok || !result.value) {
    throw new BadRequest({ location: 'posts/ctrl.remove', log: result });
  }
  ctx.status = StatusCodes.NO_CONTENT;
};
