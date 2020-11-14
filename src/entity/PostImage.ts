import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryColumn,
} from 'typeorm';
import Post from './Post';

@Entity('post_image')
export default class PostImage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createdAt!: Date;

  @ManyToOne(type => Post, post => post.images, { onDelete: 'CASCADE' })
  @JoinColumn()
  post!: Post;

  static createMany(urls: string[]): PostImage[] {
    return this.create(urls.map(url => ({ url })));
  }
  static createOne(url: string): PostImage {
    return this.create({ url });
  }
}
