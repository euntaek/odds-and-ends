import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectID,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  ObjectLiteral,
  DeepPartial,
} from 'typeorm';
import bcrypt from 'bcrypt';

import { InternalServerError } from '../errors/errRequest';
import { generateJWT } from '../lib/auth';

@Entity()
export default class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  displayName: string;

  @Column()
  hashedPassword: string;

  @Column()
  isCertified: boolean;

  @CreateDateColumn()
  publishedDate: Date;

  @DeleteDateColumn()
  deletedDate!: Date;

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.hashedPassword);
  }
  async generateUserToken(): Promise<string> {
    try {
      return await generateJWT(
        {
          _id: this._id.toString(),
          email: this.email,
          displayName: this.displayName,
          isCertified: this.isCertified,
        },
        { expiresIn: '7d' },
      );
    } catch (error) {
      throw new InternalServerError({
        message: '토큰 생성 실패',
        location: 'UserModel.generateUserToken',
        log: error,
      });
    }
  }

  static async createOne(user: DeepPartial<User>): Promise<UserInfo> {
    try {
      const createdUser = await this.create({ ...user, isCertified: false }).save();
      return { email: createdUser.email, displayName: createdUser.displayName };
    } catch (error) {
      throw new InternalServerError({ location: 'UserModel.createOne', log: error });
    }
  }
  static async getOneByOptions(options: ObjectLiteral): Promise<User | undefined> {
    console.log(options);
    try {
      return await this.findOne({ where: options });
    } catch (error) {
      throw new InternalServerError({ location: 'UserModel.getOnByEmail', log: error });
    }
  }
}
