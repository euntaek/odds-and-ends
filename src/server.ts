import database from './database';

import app from './app';

const { PORT } = process.env;

(async () => {
  await database.connection();

  app.listen(PORT, () => {
    console.log('Listening to port', PORT);
  });
})();
