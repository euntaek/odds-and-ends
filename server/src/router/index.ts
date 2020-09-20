import Router from '@koa/router';

import posts from './posts';

const router = new Router();

router.use('/posts', posts.routes());

export default router;
