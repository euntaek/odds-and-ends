import Router from '@koa/router';

import posts from './posts';
import auth from './auth';

const router = new Router();

router.use('/posts', posts.routes());
router.use('/auth', auth.routes());

export default router;
