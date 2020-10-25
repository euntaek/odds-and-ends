import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  DeepPartial,
  FindOneOptions,
} from 'typeorm';
import bcrypt from 'bcrypt';

import Profile from './Profile';
import Post from './Post';
import Comment from './Comment';

import { generateJWT } from '../utils/auth';
import { InternalServerError } from '../errors/errRequest';

import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '../constans';

@Entity('user')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  _id!: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email!: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  username!: string;

  @Column()
  hashed_password!: string;

  @Column({ default: false, type: 'boolean' })
  is_confirmed!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @OneToOne(type => Profile, profile => profile.user, { eager: true })
  profile!: Profile;

  @OneToMany(type => Post, post => post.user)
  posts!: Post[];

  @OneToMany(type => Comment, comment => comment.user)
  comments!: Comment[];

  serialize(): UserInfo {
    return {
      _id: this._id,
      email: this.email,
      username: this.username,
      is_confirmed: this.is_confirmed,
      profile: {
        _id: this.profile._id,
        display_name: this.profile.display_name,
        about: this.profile.about,
        thumbnail: this.profile.thumbnail,
      },
    };
  }
  // # instance methods
  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.hashed_password);
  }

  async generateUserToken(): Promise<UserToken> {
    try {
      const accessToken: string = await generateJWT({ _id: this._id }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      const refreshToken: string = await generateJWT({ _id: this._id }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerError({ message: 'Failed to issue user jwt', error });
    }
  }

  // # static methods
  static async createOne(userForm: DeepPartial<User>): Promise<User> {
    return this.create(userForm);
  }

  static async findOneByUUID(uuid: string): Promise<User | undefined> {
    return await this.findOne({ where: { _id: uuid } });
  }
  static async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.findOne({ where: { email } });
  }

  static async findOneByOptions(options: FindOneOptions<User>): Promise<User | undefined> {
    return await this.findOne(options);
  }
  static async upadteOne(id: number | string, body: DeepPartial<User>): Promise<boolean> {
    const result = await this.update(typeof id === 'number' ? id : { _id: id }, body);
    return result.affected === 1 ? true : false;
  }
}
