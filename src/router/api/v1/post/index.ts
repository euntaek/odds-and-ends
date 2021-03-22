import Router from '@koa/router';

import { write, list, read, remove, update, uploadImages, test } from './controller';
import { checkLoggedIn, upload } from '@/middlewares';

const post = new Router();

post.get('/test', test);

post.get('/', list);
post.post('/', checkLoggedIn, write);
post.get('/:id', read);
post.delete('/:id', checkLoggedIn, remove);
post.patch('/:id', checkLoggedIn, update);

post.post('/images', checkLoggedIn, upload('post', 'array'), uploadImages);

export default post;
