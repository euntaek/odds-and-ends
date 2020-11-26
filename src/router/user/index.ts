import Router from '@koa/router';

import { list, read, userPosts, userComments, duplicateCheck, editProfile, uploadThumbnail } from './controller';
import { checkLoggedIn, upload } from '../../middlewares';

const user = new Router();

user.get('/', list);
user.get('/:idOrUsername', read);
user.get('/:id/posts', userPosts);
user.get('/:id/comments', userComments);
user.get('/duplicate-check', duplicateCheck);
user.patch('/profile', checkLoggedIn, editProfile);
user.patch('/thumbnail', checkLoggedIn, upload('thumbnail', 'single'), uploadThumbnail);

export default user;
