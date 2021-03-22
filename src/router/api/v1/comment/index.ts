import Router from '@koa/router';

import { list, write, update, remove, test } from './controller';
import { checkLoggedIn } from '@/middlewares';

const comments = new Router();

comments.get('/test', test);

comments.get('/', list);
comments.post('/', checkLoggedIn, write);
comments.patch('/:id', checkLoggedIn, update);
comments.delete('/:id', checkLoggedIn, remove);

export default comments;
