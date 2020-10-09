import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import bcrypt from 'bcrypt';

import Profile from './Profile';

import { InternalServerError } from '../errors/errRequest';
import { generateJWT } from '../lib/auth';
import Post from './Post';
import Comment from './Comment';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  _id!: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email!: string;

  @Column()
  hashed_password!: string;

  @Column({ default: false, type: 'boolean' })
  is_certified!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne((type) => Profile, (profile) => profile.user)
  profile!: Profile;

  @OneToMany((type) => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments!: Comment[];
}
// async checkPassword(password: string): Promise<boolean> {
//   return await bcrypt.compare(password, this.hashed_password);
// }
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
