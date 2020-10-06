import { RouterContext } from '@koa/router';
import { ObjectSchema } from 'Joi';

export const validateJoi = (
  ctx: RouterContext,
  schema: ObjectSchema,
  reqPropertyName: 'body' | 'query' | 'params',
): boolean => {
  const validtaion = schema.validate(
    reqPropertyName === 'params' ? ctx.params : ctx.request[reqPropertyName],
  );
  if (validtaion.error) {
    ctx.state.error = validtaion.error;
    return false;
  }
  return true;
};
