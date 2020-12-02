import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';

import User from './User';

@Entity('follow')
export default class Follow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid' })
  followerId: string;

  @Index()
  @ManyToOne(type => User, user => user.followings)
  follower!: User;

  @Column({ type: 'uuid' })
  followingId!: string;

  @Index()
  @ManyToOne(type => User, user => user.followers)
  following!: User;

  static async createOneAndSave(userId: string, targetUserId: string): Promise<Follow> {
    return await this.create({ followerId: userId, followingId: targetUserId }).save();
  }
  static async findOneById(userId: string, targetUserId: string): Promise<Follow | undefined> {
    return await this.createQueryBuilder('follow')
      .where('follow.followerId = :userId', { userId })
      .andWhere('follow.followingId = :targetUserId', { targetUserId })
      .getOne();
  }
}
