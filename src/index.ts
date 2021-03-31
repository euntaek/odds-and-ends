import next from 'next';
import express from 'express';

import api from './api';
import { IS_PROD } from './lib/constants';
import { session } from './middleware';

const PORT = IS_PROD ? 3030 : 3030;

(async () => {
  const app = express();
  const nextApp = next({ dev: !IS_PROD });
  await nextApp.prepare();

  const handle = nextApp.getRequestHandler();

  app.use(express.json());
  app.use(session());

  app.use('/api', api);
  app.all('*', (req, res) => handle(req, res));

  app.use(function (error, req, res, next) {
    console.log(error);
    res.send(error.message);
  });

  app.listen(PORT, () => {
    console.log(`>Ready on http://localhost:${PORT} -env ${process.env.NODE_ENV}`);
  });
})();
