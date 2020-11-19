import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  OneToMany,
  Generated,
  Brackets,
} from 'typeorm';

import Post from './Post';
import User from './User';

@Entity('comment')
export default class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', unique: true })
  @Generated('increment')
  pId: number;

  @Column({ type: 'varchar', length: 255 })
  content!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt!: Date | null;

  @Column({ type: 'uuid', nullable: true })
  refComment: string;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'ref_comment' })
  refCommentId!: Comment;

  @OneToMany(() => Comment, comment => comment.refCommentId)
  subComments: Comment[];

  @Column({ type: 'uuid', nullable: true })
  replyTo: string;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'reply_to' })
  replyToId!: Comment;

  @OneToMany(() => Comment, comment => comment.replyToId)
  replies: Comment[];

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user!: User;

  @Column({ type: 'uuid' })
  postId!: string;

  @ManyToOne(() => Post)
  @JoinColumn()
  post!: Post;

  static async getAll(
    postId: string,
    pId?: string,
    refComment?: string,
    limit = 10,
  ): Promise<Comment[]> {
    const basicQb = this.createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.post', 'post')
      .addSelect(['user.id', 'user.username'])
      .leftJoin('user.profile', 'profile')
      .addSelect(['profile.id', 'profile.displayName', 'profile.thumbnail'])
      .loadRelationCountAndMap('comment.subCommentCount', 'comment.subComments')
      .where('post.id = :postId', { postId })
      .orderBy('comment.pId', 'ASC')
      .limit(limit);

    const refinedQb = refComment
      ? basicQb.andWhere('comment.refComment = :refComment', { refComment })
      : basicQb.andWhere('comment.refComment is null');

    return pId
      ? await refinedQb.andWhere('comment.pId > :pId', { pId: parseInt(pId, 10) }).getMany()
      : await refinedQb.getMany();
  }
}
