import Router from '@koa/router';

import {
  list,
  read,
  userPosts,
  userComments,
  editProfile,
  uploadThumbnail,
  follow,
  unfollow,
  followers,
  followings,
} from './controller';
import { checkLoggedIn, upload, checkUser, checkFollow } from '@/middlewares';

const users = new Router();

users.get('/', list); // TODO: 미완성. ctrl 확인
users.get('/followers', checkLoggedIn, followers);
users.get('/followings', checkLoggedIn, followings);
users.patch('/profile', checkLoggedIn, editProfile);
users.patch('/thumbnail', checkLoggedIn, upload('thumbnail', 'single'), uploadThumbnail);

users.get('/:idOrUsername', checkUser('hard'), checkFollow, read);
users.get('/:idOrUsername/posts', checkUser(), userPosts);
users.get('/:idOrUsername/comments', checkUser(), userComments); // TODO: 미완성. ctrl 확인
users.patch('/:idOrUsername/follow', checkLoggedIn, checkUser(), checkFollow, follow);
users.delete('/:idOrUsername/unfollow', checkLoggedIn, checkUser(), checkFollow, unfollow);
users.delete('/:idOrUsername/follow-check', checkLoggedIn, checkUser(), checkFollow);

export default users;
