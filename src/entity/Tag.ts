import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
} from 'typeorm';
import Post from './Post';

@Entity()
export default class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  _id!: string;

  @Index()
  @Column({ type: 'varchar', length: '255' })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToMany((type) => Post, (post) => post.tags)
  posts: Tag[];
}
