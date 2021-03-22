import { createConnection, getConnection, ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
  TYPEORM_MIGRATIONS,
  TYPEORM_SUBSCRIBERS,
} from './constans';

import * as entities from './entity';

const ormConfig: ConnectionOptions = {
  type: TYPEORM_TYPE,
  host: TYPEORM_HOST,
  port: TYPEORM_PORT,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  synchronize: TYPEORM_SYNCHRONIZE,
  logging: TYPEORM_LOGGING,
  dropSchema: TYPEORM_DROPSCHEMA,
  entities: Object.values(entities),
  migrations: [TYPEORM_MIGRATIONS],
  subscribers: [TYPEORM_SUBSCRIBERS],
  namingStrategy: new SnakeNamingStrategy(),
};

const dbConnection = (connectionOptions: ConnectionOptions = ormConfig) =>
  createConnection(connectionOptions);

export const dbConnectionClose = () => getConnection().close();

export default dbConnection;
