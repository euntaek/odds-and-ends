import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import Post from './Post';

@Entity('post_image')
export default class PostImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @ManyToOne(type => Post, post => post.images, { onDelete: 'CASCADE' })
  @JoinColumn({ referencedColumnName: '_id' })
  post!: Post;

  static createMany(urls: string[]): PostImage[] {
    return this.create(urls.map(url => ({ url })));
  }
  static createOne(url: string): PostImage {
    return this.create({ url });
  }
}
