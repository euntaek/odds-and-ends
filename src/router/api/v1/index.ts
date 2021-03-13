import Router from '@koa/router';

import auth from './auth';
import user from './user';
import post from './post';
import comment from './comment';

const v1 = new Router();

v1.use('/auth', auth.routes());
v1.use('/user', user.routes());
v1.use('/post', post.routes());
v1.use('/comment', comment.routes());

v1.get('/health', ctx => {
  ctx.body = 'OK!';
});

export default v1;
