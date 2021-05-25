import Router from '@koa/router';

import { write, list, read, remove, update, uploadImages } from './controller';
import { checkLoggedIn, upload } from '@/middlewares';

const posts = new Router();

posts.get('/', list);
posts.get('/:id', read);
posts.post('/', checkLoggedIn, write);
posts.post('/images', checkLoggedIn, upload('posts', 'array'), uploadImages);
posts.patch('/:id', checkLoggedIn, update);
posts.delete('/:id', checkLoggedIn, remove);

export default posts;
