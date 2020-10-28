import Router from '@koa/router';

import auth from './auth';
import posts from './posts';
import comments from './comment';

const router = new Router();

posts.use('/:id/comments', comments.routes());

router.use('/auth', auth.routes());
router.use('/posts', posts.routes());

export default router;
