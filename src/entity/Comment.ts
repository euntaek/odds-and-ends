import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Post from './Post';
import User from './User';

@Entity('comment')
export default class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  _id!: string;

  @Column({ type: 'varchar', length: 255 })
  text!: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  ref_comment!: string | null;

  @Column({ type: 'smallint', default: 0 })
  reply_count!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  deleted_at!: Date | null;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: '_id' })
  user!: User;

  @ManyToOne(() => Post, { cascade: true })
  @JoinColumn({ referencedColumnName: '_id' })
  posts!: Post[];
}
