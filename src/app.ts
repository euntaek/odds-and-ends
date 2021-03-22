import Koa, { Context } from 'koa';
import logger from 'koa-logger';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

import dbConnection from './database';
import router from './router';
import { hydrateUser } from './middlewares';
import { RequestError } from './errors/errRequest';

const appLoader = async (app: Koa) => {
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.statusCode || 500;
      ctx.body = { message: err.message };
      ctx.app.emit('error', err, ctx);
    }
  });

  app.on('error', (err: RequestError, ctx: Context) => {
    console.log('\x1b[31m%s\x1b[0m', 'Error==========');
    console.log(err);
    console.log('request: ', ctx.request, 'response: ', ctx.response);
    console.log('\x1b[31m%s\x1b[0m', '===============');
  });

  app.use(logger());
  app.use(cors());
  app.use(bodyParser());

  app.use(hydrateUser);
  app.use(router.routes()).use(router.allowedMethods());
};

class App {
  private app: Koa;
  private port: number;

  constructor() {
    this.app = new Koa();
  }

  async bootstrap(PORT: number) {
    await appLoader(this.app);
    await dbConnection();

    this.app.listen(PORT, () => {
      console.log('Listening to port', PORT);
    });
  }
}

export default App;
