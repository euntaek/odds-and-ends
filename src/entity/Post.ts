import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  DeepPartial,
} from 'typeorm';

import User from './User';
import Comment from './Comment';
import PostImage from './PostImage';
import Tag from './Tag';

@Entity('post')
export default class Post extends BaseEntity {
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

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(type => User, user => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @OneToMany(type => PostImage, postImage => postImage.post)
  images!: PostImage[];

  @OneToMany(type => Comment, comment => comment.post)
  comments!: Comment[];

  @ManyToMany(() => Tag, tag => tag.posts)
  @JoinTable({ name: 'post_and_tag' })
  tags!: Tag[];

  static async getAll(userId?: string, tagId?: string, pId?: string, limit?: number): Promise<Post[]>;
  static async getAll(userIds?: string[], tagId?: string, pId?: string, limit?: number): Promise<Post[]>;
  static async getAll(userIds?: string | string[], tagId?: string, pId?: string, limit = 20): Promise<Post[]> {
    const qb = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .addSelect(['user.id', 'user.username'])
      .leftJoin('user.profile', 'profile')
      .addSelect(['profile.id', 'profile.displayName', 'profile.thumbnail'])
      .leftJoinAndSelect('post.tags', 'tags')
      .loadRelationCountAndMap('post.commnetCount', 'post.comments')
      .where('', { tagId })
      .orderBy('post.pId', 'DESC')
      .limit(limit);

    return pId ? await qb.andWhere('post.pId < :pId', { pId: parseInt(pId, 10) }).getMany() : await qb.getMany();
  }
  static createOne(postForm: DeepPartial<Post>): Post {
    return this.create(postForm);
  }
  static async findOneById(postId: string): Promise<Post | null> {
    const post = await this.createQueryBuilder('post').where('post.id =:postId', { postId }).getOne();
    return post || null;
  }
}
