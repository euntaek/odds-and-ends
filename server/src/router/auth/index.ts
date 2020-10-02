import Router from '@koa/router';

import {
  register,
  login,
  check,
  logout,
  emailConfirmation,
  usernameVerification,
} from './controller';

const auth = new Router();

auth.post('/login', login);
auth.post('/register', register);
auth.get('/check/:token', check);
auth.post('/logout', logout);
auth.post('/email_confirmation', emailConfirmation);
auth.get('/username/:username', usernameVerification);

export default auth;
