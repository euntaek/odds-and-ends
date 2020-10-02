import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectID,
  CreateDateColumn,
  Index,
  BaseEntity,
} from 'typeorm';

import { InternalServerError } from '../errors/errRequest';

@Entity()
export default class EmailAuth extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  token: string;

  @Column()
  isVerified: boolean;

  @CreateDateColumn()
  @Index({ expireAfterSeconds: 86400 })
  publishedDate: Date;

  static async createOne(type: 'register', email: string, token: string): Promise<EmailAuth> {
    try {
      return await this.create({ type, email, token, isVerified: false }).save();
    } catch (error) {
      throw new InternalServerError({ location: 'EamilAuth.createOne', log: error });
    }
  }
  static async getOneByToken(token: string): Promise<EmailAuth | undefined> {
    try {
      return await this.findOne({ where: { token } });
    } catch (error) {
      throw new InternalServerError({ location: 'EamilAuth.findOne', log: error });
    }
  }
}
