import Router from '@koa/router';

import auth from './auth';
import post from './post';
import comment from './comment';

const router = new Router();

router.use('/auth', auth.routes());
router.use('/post', post.routes());
router.use('/comment', comment.routes());

export default router;
