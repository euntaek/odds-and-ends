import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  DeepPartial,
  FindOneOptions,
} from 'typeorm';
// import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';

import { Profile, Follow, Post, Comment } from './';

import { generateJWT } from '../utils/auth';
import { InternalServerError } from '../errors/errRequest';

import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '../constans';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email!: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  username!: string;

  @Column({ type: 'varchar', select: false })
  hashedPassword!: string;

  @Column({ type: 'boolean', default: false })
  isConfirmed!: boolean;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updatedAt!: Date;

  // { eager: true } : 같이 가져올지 안가져올지
  @OneToOne(type => Profile, profile => profile.user, { eager: false })
  profile!: Profile;

  @OneToMany(type => Post, post => post.user)
  posts!: Post[];

  @OneToMany(type => Comment, comment => comment.user)
  comments!: Comment[];

  @OneToMany(type => Follow, follow => follow.following)
  followers!: Follow[];

  @OneToMany(type => Follow, follow => follow.follower)
  followings!: Follow[];

  // serialize(): UserInfo {
  //   return {
  //     _id: this._id,
  //     email: this.email,
  //     username: this.username,
  //     profile: {
  //       _id: this.profile._id,
  //       displayName: this.profile.displayName,
  //       thumbnail: this.profile.thumbnail,
  //     },
  //   };
  // }
  // # instance methods
  async checkPassword(password: string): Promise<boolean> {
    const id = this.id;

    const user = await User.createQueryBuilder('user')
      .select('user.hashedPassword')
      .where('user.id = :id', { id })
      .getOne();

    return user ? await bcrypt.compare(password, user.hashedPassword) : false;
  }

  async generateUserToken(): Promise<UserToken> {
    try {
      const accessToken: string = await generateJWT({ id: this.id }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      const refreshToken: string = await generateJWT({ id: this.id }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'USER_TOKEN_GENERATION_ERROR' });
    }
  }

  // # static methods
  static createOne(userForm: DeepPartial<User>): User {
    return this.create(userForm);
  }

  static async findOneByKeyValue(
    key: 'id' | 'username' | 'email',
    value: string,
  ): Promise<User | undefined> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .loadRelationCountAndMap('user.followerCount', 'user.followers')
      .loadRelationCountAndMap('user.followingsCount', 'user.followings')
      .where(`user.${key} = :value`, { value })
      .getOne();
  }

  static async findOneByOptions(options: FindOneOptions<User>): Promise<User | undefined> {
    return await this.findOne(options);
  }
  static async upadteOne(id: number | string, body: DeepPartial<User>): Promise<boolean> {
    const result = await this.update(id, body);
    return result.affected === 1 ? true : false;
  }
}
