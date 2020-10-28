import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

export const test: Middleware = ctx => {
  ctx.status = StatusCodes.OK;
  ctx.body = { message: 'success' };
};
