import Router from '@koa/router';

import { register, login, check, logout, usernameVerification } from './controller';

const auth = new Router();

auth.post('/login', login);
auth.post('/register', register);
auth.get('/check', check);
auth.post('/logout', logout);
auth.get('/username/:username', usernameVerification);

export default auth;
