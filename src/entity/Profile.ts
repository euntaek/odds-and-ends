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

  @Column({ type: 'varchar', length: 255, nullable: true })
  about!: string;

  @Column({ type: 'varchar', default: 'thumbnail:url' })
  thumbnail: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ referencedColumnName: '_id' })
  user!: User;

  static createOne(profile: DeepPartial<Profile>): Profile {
    return this.create(profile);
  }

  static async upadteOne(id: number | string, body: DeepPartial<Profile>): Promise<boolean> {
    const result = await this.update(typeof id === 'number' ? id : { _id: id }, body);
    return result.affected === 1 ? true : false;
  }
}
