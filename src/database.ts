import { createConnection, getConnection, ConnectionOptions } from 'typeorm';
import 'reflect-metadata';
import 'pg';

import {
  TYPEORM_TYPE,
  TYPEORM_HOST,
  TYPEORM_PORT,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_SYNCHRONIZE,
  TYPEORM_LOGGING,
  TYPEORM_DROPSCHEMA,
  TYPEORM_ENTITIES,
  TYPEORM_MIGRATIONS,
  TYPEORM_SUBSCRIBERS,
} from './constans';

export default {
  async connection(): Promise<void> {
    const connectionOptions: ConnectionOptions = {
      type: TYPEORM_TYPE as any,
      host: TYPEORM_HOST,
      port: TYPEORM_PORT,
      username: TYPEORM_USERNAME,
      password: TYPEORM_PASSWORD,
      database: TYPEORM_DATABASE,
      synchronize: TYPEORM_SYNCHRONIZE,
      logging: TYPEORM_LOGGING,
      dropSchema: TYPEORM_DROPSCHEMA,
      entities: [TYPEORM_ENTITIES],
      migrations: [TYPEORM_MIGRATIONS],
      subscribers: [TYPEORM_SUBSCRIBERS],
    };
    try {
      await createConnection(connectionOptions);
      console.log('Databae connected');
    } catch (e) {
      throw new Error(e);
    }
  },
  async connectionClose(): Promise<void> {
    try {
      await getConnection().close();
    } catch (e) {
      throw new Error(e);
    }
  },
};
