import Router from '@koa/router';

import { test } from './controller';

const comments = new Router();

comments.get('/test', test);

export default comments;
