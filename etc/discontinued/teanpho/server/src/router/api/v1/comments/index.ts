import Router from '@koa/router';

import { list, write, update, remove } from './controller';
import { checkLoggedIn } from '@/middlewares';

const comments = new Router();

comments.get('/', list);
comments.post('/', checkLoggedIn, write);
comments.patch('/:id', checkLoggedIn, update);
comments.delete('/:id', checkLoggedIn, remove);

export default comments;
