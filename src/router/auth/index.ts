import Router from '@koa/router';

import { register, login, refresh, emailConfirmation, duplicateCheck, test } from './controller';
import { checkLoggedOut } from '../../middlewares';

const auth = new Router();

auth.post('/register', checkLoggedOut, register);
auth.post('/login', checkLoggedOut, login);
auth.post('/refresh', refresh);
auth.patch('/email_confirmation', emailConfirmation);
auth.get('/duplicate_check', duplicateCheck);
auth.get('/test', test);

export default auth;
