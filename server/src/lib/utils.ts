import { RouterContext } from '@koa/router';
import { ObjectSchema } from 'Joi';
import { DeepPartial } from 'typeorm';

import Post from '../entity/Post';

export const validateBody = (ctx: RouterContext, schema: ObjectSchema): boolean => {
  const validtaion = schema.validate(ctx.request.body);
  console.log(validtaion);
  if (validtaion.error) {
    ctx.state.error = validtaion.error;
    return false;
  }
  return true;
};

export const refindPosts = (posts: Post[]): DeepPartial<Post>[] =>
  posts.map((post) => ({
    ...post,
    body: post.body.length < 100 ? post.body : `${post.body.slice(0, 100)}...`,
  }));
