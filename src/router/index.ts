import Router from '@koa/router';

import auth from './auth';
import user from './user';
import post from './post';
import comment from './comment';

const router = new Router();

router.use('/auth', auth.routes());
router.use('/user', user.routes());
router.use('/post', post.routes());
router.use('/comment', comment.routes());

router.get('/health', ctx => {
  ctx.body = 'OK!';
});

export default router;
