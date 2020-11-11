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
import Post from './Post';

@Entity('tag')
export default class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  _id!: string;

  @Column({ type: 'varchar', length: '255', unique: true })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @ManyToMany(type => Post, post => post.tags)
  posts!: Post[];

  static createOne(tag: string): Tag {
    return this.create({ name: tag });
  }

  static async findOneByName(name: string): Promise<Tag | undefined> {
    return await this.createQueryBuilder('tag').where('tag.name = :name', { name }).getOne();
  }
}
