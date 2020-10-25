import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Post from './Post';
import Tag from './Tag';

@Entity('tag_alias')
export default class TagAlias {
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

  @ManyToMany(type => Post, post => post.tag_aliases)
  posts!: Post[];

  @Column('uuid')
  tag_id!: string;

  @ManyToOne(type => Tag)
  @JoinColumn({ referencedColumnName: '_id' })
  tag!: Tag;
}
