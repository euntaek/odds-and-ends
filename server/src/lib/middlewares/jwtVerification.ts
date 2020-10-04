import { Middleware } from 'koa';
import jwt from 'jsonwebtoken';

const { SECRET_KEY } = process.env;

const jwtVerification: Middleware = (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, SECRET_KEY ?? '');
    if (typeof decoded === 'string') return next();
    ctx.state.user = decoded;
    console.log(decoded);
    return next();
  } catch (error) {
    return next();
  }
};

export default jwtVerification;
