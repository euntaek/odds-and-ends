import Router from '@koa/router';

import { register, login, refresh, emailConfirmation, check } from './controller';
import { checkLoggedOut, checkLoggedIn } from '@/middlewares';

const auth = new Router();

auth.get('/check', checkLoggedIn, check);
auth.post('/register', checkLoggedOut, register);
auth.post('/login', checkLoggedOut, login);
auth.post('/refresh', refresh);
auth.patch('/email-confirmation', emailConfirmation);

export default auth;
