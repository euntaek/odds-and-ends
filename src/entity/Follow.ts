import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';

import User from './User';

@Entity('follow')
export default class Follow extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', select: false })
  followerId: string;

  @Index()
  @ManyToOne(type => User, user => user.followings)
  follower!: User;

  @Column({ type: 'uuid', select: false })
  followingId!: string;

  @Index()
  @ManyToOne(type => User, user => user.followers)
  following!: User;

  static async createOneAndSave(user: User, targetUser: User): Promise<Follow> {
    return await this.create({ follower: user, following: targetUser }).save();
  }
  static async findOneById(userId: string, targetUserId: string): Promise<Follow | undefined> {
    return await this.createQueryBuilder('follow')
      .where('follow.followerId = :userId', { userId })
      .andWhere('follow.followingId = :targetUserId', { targetUserId })
      .getOne();
  }

  static async getAllFollowersById(userId: string): Promise<Follow[]> {
    return await this.createQueryBuilder('follow')
      .leftJoin('follow.follower', 'follower')
      .addSelect(['follower.id', 'follower.username'])
      .leftJoin('follower.profile', 'profile')
      .addSelect(['profile.id', 'profile.displayName', 'profile.thumbnail'])
      .where('follow.followingId = :userId', { userId })
      .getMany();
  }

  static async getAllFollowingsById(userId: string): Promise<Follow[]> {
    return await this.createQueryBuilder('follow')
      .leftJoin('follow.following', 'following')
      .addSelect(['following.id', 'following.username'])
      .leftJoin('following.profile', 'profile')
      .addSelect(['profile.id', 'profile.displayName', 'profile.thumbnail'])
      .where('follow.followerId = :userId', { userId })
      .getMany();
  }
}
