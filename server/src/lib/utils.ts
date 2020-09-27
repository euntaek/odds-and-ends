import { RouterContext } from '@koa/router';
import { ObjectSchema } from 'Joi';
import { DeepPartial } from 'typeorm';

import Post from '../entity/Post';

export const validateJoi = (
  ctx: RouterContext,
  schema: ObjectSchema,
  reqPropertyName: 'body' | 'query' | 'params',
): boolean => {
  const validtaion = schema.validate(
    reqPropertyName === 'params' ? ctx.params : ctx.request[reqPropertyName],
  );
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
