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

import { User, Comment, PostImage, Tag } from './';

@Entity('post')
export class Post extends BaseEntity {
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

  static async getAll(
    userId?: string | string[],
    tagName?: string,
    pId?: string,
    limit = 20,
  ): Promise<Post[]> {
    const qb = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .addSelect(['user.id', 'user.username'])
      .leftJoin('user.profile', 'profile')
      .addSelect(['profile.id', 'profile.displayName', 'profile.thumbnail'])
      .leftJoinAndSelect('post.tags', 'tag')
      .loadRelationCountAndMap('post.commnetCount', 'post.comments')
      .where(tagName ? 'tag.name = :tagName' : '', { tagName })
      .orderBy('post.pId', 'DESC')
      .limit(limit);

    // const refinedQb = !Array.isArray(userId) ? qb.andWhere('user.id = :userId', { userId }) : qb;

    return pId
      ? await qb.andWhere('post.pId < :pId', { pId: parseInt(pId, 10) }).getMany()
      : await qb.getMany();
  }
  static createOne(postForm: DeepPartial<Post>): Post {
    return this.create(postForm);
  }
  static async findOneById(postId: string): Promise<Post | undefined> {
    const post = await this.createQueryBuilder('post')
      .where('post.id =:postId', { postId })
      .getOne();
    return post;
  }
}
