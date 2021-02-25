import connectRedis from 'connect-redis';
import expressSession from 'express-session';
import redis from 'redis';

import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, SESSION_SECRET } from '../constants';

export function session() {
  const RedisStore = connectRedis(expressSession);

  const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  });

  return expressSession({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    store: new RedisStore({
      client: redisClient,
    }),
  });
}
