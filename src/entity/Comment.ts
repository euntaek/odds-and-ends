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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  content!: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  refComment!: string | null;

  @Column({ type: 'smallint', default: 0 })
  replyCount!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt!: Date | null;

  @ManyToOne(() => User)
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Post, { cascade: true })
  @JoinColumn()
  posts!: Post[];
}
