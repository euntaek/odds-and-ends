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

import { generateJWT } from '../lib/auth';

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
        thumbnail: this.profile.thumbnail,
      },
    };
  }
  // instance methods
  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.hashed_password);
  }

  // static methods
  static async createOne(userForm: DeepPartial<User>): Promise<User> {
    return this.create(userForm);
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

// async generateUserToken(): Promise<string> {
//   try {
//     return await generateJWT(
//       {
//         _id: this._id.toString(),
//         email: this.email,
//         isCertified: this.is_certified,
//       },
//       { expiresIn: '7d' },
//     );
//   } catch (error) {
//     throw new InternalServerError({
//       message: '토큰 생성 실패',
//       location: 'UserModel.generateUserToken',
//       log: error,
//     });
//   }

// static async createOne(user: DeepPartial<User>): Promise<UserInfo> {
//   try {
//     const createdUser = await this.create({ ...user, isCertified: false }).save();
//     return { email: createdUser.email, displayName: createdUser.displayName };
//   } catch (error) {
//     throw new InternalServerError({ location: 'UserModel.createOne', log: error });
//   }
// }
// static async getOneByOptions(options: ObjectLiteral): Promise<User | undefined> {
//   console.log(options);
//   try {
//     return await this.findOne({ where: options });
//   } catch (error) {
//     throw new InternalServerError({ location: 'UserModel.getOnByEmail', log: error });
//   }
// }
