import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeepPartial,
} from 'typeorm';
import User from './User';

@Entity('profile')
export default class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  about!: string;

  @Column({ type: 'varchar', default: 'thumbnail:url' })
  thumbnail: string;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updatedAt!: Date;

  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  static createOne(profile: DeepPartial<Profile>): Profile {
    return this.create(profile);
  }

  static async upadteOne(id: number | string, body: DeepPartial<Profile>): Promise<boolean> {
    const result = await this.update(id, body);
    return result.affected === 1 ? true : false;
  }
}
