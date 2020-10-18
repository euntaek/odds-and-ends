import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeepPartial,
} from 'typeorm';
import User from './User';

@Entity('profile')
export default class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  _id!: string;

  @Column({ type: 'varchar', length: 255 })
  display_name: string;

  @Column({ type: 'varchar', default: 'thumbnail:url' })
  thumbnail: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ referencedColumnName: '_id' })
  user!: User;

  static async createOne(profile: DeepPartial<Profile>): Promise<Profile> {
    return this.create(profile);
  }
}
