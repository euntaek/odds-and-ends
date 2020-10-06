import 'reflect-metadata';
import 'mongodb';
import { createConnection, getConnection } from 'typeorm';

export default {
  async connection(): Promise<void> {
    try {
      await createConnection();
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
