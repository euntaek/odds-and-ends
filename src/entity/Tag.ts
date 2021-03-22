import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  BaseEntity,
} from 'typeorm';
import { Post } from './';

@Entity('tag')
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: '255', unique: true })
  name: string;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updatedAt!: Date;

  @ManyToMany(type => Post, post => post.tags, { onDelete: 'CASCADE' })
  posts!: Post[];

  static createOne(tag: string): Tag {
    return this.create({ name: tag });
  }

  static async findOneByName(name: string): Promise<Tag | undefined> {
    return await this.createQueryBuilder('tag').where('tag.name = :name', { name }).getOne();
  }
}
