import Router from '@koa/router';

import {
  register,
  login,
  check,
  logout,
  emailVerification,
  displayNameVerification,
  emailConfirmation,
} from './controller';

const auth = new Router();

auth.post('/login', login);
auth.post('/register', register);
auth.get('/check', check);
auth.post('/logout', logout);
auth.post('/email_confirmation', emailConfirmation);
auth.get('/email/:email', emailVerification);
auth.get('/displayname/:displayName', displayNameVerification);

export default auth;
