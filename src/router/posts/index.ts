import Router from '@koa/router';

import { write, list, read, remove, update, uploadImages, test } from './controller';
import { checkLoggedIn, upload } from '../../middlewares';

const posts = new Router();

posts.get('/', list);
posts.post('/', checkLoggedIn, write);

posts.get('/test', test);

posts.get('/:id', read);
posts.delete('/:id', checkLoggedIn, remove);
posts.patch('/:id', checkLoggedIn, update);

posts.post('/images', checkLoggedIn, upload('images'), uploadImages);

export default posts;
