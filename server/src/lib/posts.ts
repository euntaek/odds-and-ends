import { DeepPartial } from 'typeorm';

import Post from '../entity/Post';

export const refindPosts = (posts: Post[]): DeepPartial<Post>[] =>
  posts.map((post) => ({
    ...post,
    body: post.body.length < 100 ? post.body : `${post.body.slice(0, 100)}...`,
  }));
