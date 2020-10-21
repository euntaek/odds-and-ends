import Router from '@koa/router';

import {
  register,
  login,
  refresh,
  // check,
  // logout,
  // emailVerification,
  // displayNameVerification,
  emailConfirmation,
  test,
} from './controller';

const auth = new Router();

auth.post('/register', register);
auth.post('/login', login);
auth.post('/refresh', refresh);
// auth.get('/check', check);
auth.patch('/email_confirmation', emailConfirmation);
// auth.get('/email/:email', emailVerification);
// auth.get('/displayname/:displayName', displayNameVerification);
auth.get('/test', test);

export default auth;
