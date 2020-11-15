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
  FindManyOptions,
  DeepPartial,
  PrimaryColumn,
} from 'typeorm';

import User from './User';
import Comment from './Comment';
import PostImage from './PostImage';
import Tag from './Tag';

@Entity('post')
export default class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  content!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updatedAt!: Date;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @OneToMany(type => PostImage, postImage => postImage.post)
  images!: PostImage[];

  @OneToMany(type => Comment, comment => comment.posts)
  comments!: string;

  @ManyToMany(() => Tag, tag => tag.posts)
  @JoinTable({ name: 'post_and_tag' })
  tags!: Tag[];

  static createOne(postForm: DeepPartial<Post>): Post {
    return this.create(postForm);
  }
  static async findOneById(postId: string): Promise<Post | null> {
    const post = await this.createQueryBuilder('post')
      .where('post.id =:postId', { postId })
      .getOne();
    return post || null;
  }
}
