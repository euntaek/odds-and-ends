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
  DeepPartial,
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
  refCommentId: string;

  @ManyToOne(() => Comment)
  @JoinColumn()
  refComment!: Comment;

  @OneToMany(() => Comment, comment => comment.refComment)
  subComments: Comment[];

  @Column({ type: 'uuid', nullable: true })
  replyToId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  replyTo!: User;

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

  static async getAll(postId: string, pId?: string, refComment?: string, limit = 100): Promise<Comment[]> {
    const qb = this.createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.post', 'post')
      .addSelect(['user.id', 'user.username'])
      .leftJoin('user.profile', 'profile')
      .addSelect(['profile.id', 'profile.displayName', 'profile.thumbnail'])
      .where('post.id = :postId', { postId })
      .orderBy('comment.pId', 'ASC')
      .limit(limit);

    const readRepliesQb = refComment
      ? qb
          .leftJoin('comment.replyTo', 'replyTo')
          .addSelect(['replyTo.id', 'replyTo.username'])
          .andWhere('comment.refComment = :refComment', { refComment })
      : qb
          .andWhere('comment.refComment is null')
          .loadRelationCountAndMap('comment.subCommentCount', 'comment.subComments');

    return pId
      ? await readRepliesQb.andWhere('comment.pId > :pId', { pId: parseInt(pId, 10) }).getMany()
      : await readRepliesQb.getMany();
  }

  static async createOneAndSave(writForm: DeepPartial<Comment>): Promise<Comment> {
    return await this.create(writForm).save();
  }

  static async findOneById(commentId: string): Promise<Comment | null> {
    const comment = await this.createQueryBuilder('comment').where('comment.id =:commentId', { commentId }).getOne();
    return comment || null;
  }
}
