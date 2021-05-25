import { Middleware } from '@koa/router';

import UserService from '@/services/UserService';
import { generateSchemaAndValue, validateSchema } from '@/utils/reqValidation';
import { BadRequest } from '@/errors/errRequest';

// # 유저 체크
export const checkUser = (relation: null | 'soft' | 'hard' = null): Middleware => {
  return async (ctx, next) => {
    const { idOrUsername }: { idOrUsername: string } = ctx.params;

    const isId = idOrUsername[0] !== '@';
    const key = isId ? 'id' : 'username';
    const value = isId ? idOrUsername : idOrUsername.slice(1);

    const schemaAndValue = generateSchemaAndValue({ [key]: value });
    if (!validateSchema(ctx, ...schemaAndValue)) {
      return ctx.throw(new BadRequest(ctx.state.error));
    }

    const userService = new UserService();
    console.log('\x1b[32m%s\x1b[0m', 'start--------------checkUser--------------');
    const getOneUserResult = await userService.getOneUser(key, value, relation);
    console.log('\x1b[32m%s\x1b[0m', 'end----------------checkUser--------------');
    if (!getOneUserResult.success) {
      return ctx.throw(new BadRequest(getOneUserResult.error));
    }
    ctx.state.targetUser = getOneUserResult.data;
    return next();
  };
};
