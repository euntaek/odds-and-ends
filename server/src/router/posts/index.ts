import Router from '@koa/router';

import { write, list, read, remove, removeMany, update } from './controller';

const posts = new Router();

posts.get('/', list);
posts.post('/', write);
posts.get('/:id', read);
posts.delete('/:id', remove);
posts.delete('/', removeMany);
posts.patch('/:id', update);

export default posts;
