import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Tag from './Tag';

@Entity()
export default class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  _id!: string;

  @Column({ type: 'varchar', length: 255 })
  body!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  delted_at!: Date | null;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'post_and_tag',
    joinColumn: { referencedColumnName: '_id' },
    inverseJoinColumn: { referencedColumnName: '_id' },
  })
  tags!: Tag[];
}
