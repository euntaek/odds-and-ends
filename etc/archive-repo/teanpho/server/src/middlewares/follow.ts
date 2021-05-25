import { Middleware } from '@koa/router';

import UserService from '@/services/UserService';
import { BadRequest } from '@/errors/errRequest';

// # 팔로우 체크
export const checkFollow: Middleware = async (ctx, next) => {
  if (!ctx.state.user || ctx.state.user.id === ctx.state.targetUser.id) {
    const message = !ctx.state.user ? '로그인이 필요합니다.' : '잘못 된 접근입니다.';
    return ctx.throw(new BadRequest({ name: 'CHECK_FOLLOW_FAILURE', message }));
  }
  const userService = new UserService();
  console.log('\x1b[32m%s\x1b[0m', 'start--------------checkFollow--------------');
  const checkFollowResult = await userService.checkFollow(ctx.state.user, ctx.state.targetUser);
  console.log('\x1b[32m%s\x1b[0m', 'end----------------checkFollow--------------');
  console.log(checkFollowResult.data);
  ctx.state.isFollowing = !!checkFollowResult.data;
  ctx.state.follow = checkFollowResult.data;
  return next();
};
