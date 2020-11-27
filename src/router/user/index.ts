import Router from '@koa/router';

import {
  list,
  read,
  userPosts,
  userComments,
  duplicateCheck,
  editProfile,
  uploadThumbnail,
  checkUser,
} from './controller';
import { checkLoggedIn, upload } from '../../middlewares';

const user = new Router();

user.get('/', list);
user.get('/duplicate-check', duplicateCheck);
user.patch('/profile', checkLoggedIn, editProfile);
user.patch('/thumbnail', checkLoggedIn, upload('thumbnail', 'single'), uploadThumbnail);

user.get('/:idOrUsername', checkUser, read);
user.get('/:idOrUsername/posts', checkUser, userPosts);
user.get('/:idOrUsername/comments', checkUser, userComments);

export default user;
