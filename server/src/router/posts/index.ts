import Router from '@koa/router';

import { write, list, read, remove, removeMany, update } from './controller';
import { checkObjectId } from '../../lib/middlewares/utils';

const posts = new Router();

posts.get('/', list);
posts.post('/', write);
posts.delete('/', removeMany);
posts.get('/:id', checkObjectId, read);
posts.delete('/:id', checkObjectId, remove);
posts.patch('/:id', checkObjectId, update);

export default posts;
