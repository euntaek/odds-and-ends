import { RouterContext } from '@koa/router';
import { ObjectSchema } from 'Joi';

export const validateBody = (ctx: RouterContext, schema: ObjectSchema): boolean => {
  const validtaion = schema.validate(ctx.request.body);
  console.log(validtaion);
  if (validtaion.error) {
    ctx.state.error = validtaion.error;
    return false;
  }
  return true;
};
