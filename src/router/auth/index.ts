import Router from '@koa/router';

import { register, login, refresh, emailConfirmation, duplicateCheck, test } from './controller';
import { checkLoggedOut } from '../../middlewares';

const auth = new Router();

auth.post('/register', checkLoggedOut, register);
auth.post('/login', checkLoggedOut, login);
auth.post('/refresh', refresh);
auth.patch('/email-confirmation', emailConfirmation);
auth.get('/duplicate', duplicateCheck);
auth.get('/test', test);

export default auth;
