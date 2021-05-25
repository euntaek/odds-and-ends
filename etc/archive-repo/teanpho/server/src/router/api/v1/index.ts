import Router from '@koa/router';

import auth from './auth';
import users from './users';
import posts from './posts';
import comments from './comments';

const v1 = new Router();

v1.use('/auth', auth.routes());
v1.use('/users', users.routes());
v1.use('/posts', posts.routes());
v1.use('/comments', comments.routes());

v1.get('/health', ctx => {
  ctx.body = 'OK!';
});

export default v1;
