import Router from '@koa/router';

import {
  list,
  read,
  userPosts,
  userComments,
  checkDuplicate,
  editProfile,
  uploadThumbnail,
  follow,
  unfollow,
  followers,
  followings,
  checkUser,
  checkFollow,
  test,
} from './controller';
import { checkLoggedIn, upload } from '../../middlewares';

const user = new Router();

user.get('/test', test);

user.get('/', list);
user.get('/duplicate-check', checkDuplicate);
user.patch('/profile', checkLoggedIn, editProfile);
user.patch('/thumbnail', checkLoggedIn, upload('thumbnail', 'single'), uploadThumbnail);
user.get('/followers', checkLoggedIn, followers);
user.get('/followings', checkLoggedIn, followings);

user.get('/:idOrUsername', checkUser, checkFollow, read);
user.get('/:idOrUsername/posts', checkUser, userPosts);
user.get('/:idOrUsername/comments', checkUser, userComments);
user.patch('/:idOrUsername/follow', checkLoggedIn, checkUser, checkFollow, follow);
user.delete('/:idOrUsername/unfollow', checkLoggedIn, checkUser, checkFollow, unfollow);
user.delete('/:idOrUsername/follow-check', checkLoggedIn, checkUser, checkFollow);

export default user;
