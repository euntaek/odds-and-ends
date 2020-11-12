import Router from '@koa/router';

import {
  register,
  login,
  editProfile,
  uploadThumbnail,
  refresh,
  emailConfirmation,
  duplicateCheck,
  test,
} from './controller';
import { checkLoggedOut, checkLoggedIn, upload } from '../../middlewares';

const auth = new Router();

auth.post('/register', checkLoggedOut, register);
auth.post('/login', checkLoggedOut, login);
auth.post('/refresh', refresh);
auth.patch('/profile', checkLoggedIn, editProfile);
auth.patch('/thumbnail', checkLoggedIn, upload('thumbnail', 'single'), uploadThumbnail);
auth.patch('/email-confirmation', emailConfirmation);
auth.get('/duplicate', duplicateCheck);
auth.get('/test', test);

export default auth;
