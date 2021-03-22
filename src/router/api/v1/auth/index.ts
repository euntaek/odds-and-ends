import Router from '@koa/router';

import { register, login, refresh, emailConfirmation, check, test } from './controller';
import { checkLoggedOut, checkLoggedIn } from '@/middlewares';

const auth = new Router();

auth.post('/register', checkLoggedOut, register);
auth.post('/login', checkLoggedOut, login);
auth.post('/refresh', refresh);
auth.patch('/email-confirmation', emailConfirmation);
auth.get('/check', checkLoggedIn, check);
auth.get('/test', test);

export default auth;
