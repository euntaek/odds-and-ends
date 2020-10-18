import Router from '@koa/router';

import {
  register,
  login,
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
// auth.get('/check', check);
// auth.post('/logout', logout);
auth.patch('/email_confirmation', emailConfirmation);
// auth.get('/email/:email', emailVerification);
// auth.get('/displayname/:displayName', displayNameVerification);
auth.get('/test/:emailAuthToken', test);

export default auth;
