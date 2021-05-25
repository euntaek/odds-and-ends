import connectRedis from 'connect-redis';
import expressSession from 'express-session';
import redis from 'redis';

export function session() {
  const RedisStore = connectRedis(expressSession);

  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  });

  return expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    store: new RedisStore({
      client: redisClient,
    }),
  });
}
