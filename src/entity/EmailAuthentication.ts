import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  DeepPartial,
  Index,
} from 'typeorm';

@Entity('email_authentication')
export default class EmailAuthentication extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  type!: string;

  @Column('uuid')
  userId!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  token!: string;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  confirmedAt!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  static async createOneAndSave(
    emailAuthForm: DeepPartial<EmailAuthentication>,
  ): Promise<EmailAuthentication> {
    return await this.create(emailAuthForm).save();
  }

  static async findOneByTokenAndType(
    token: string,
    type: 'register' | 'resetPassword',
  ): Promise<EmailAuthentication | undefined> {
    return await this.createQueryBuilder('email_authentication')
      .where('email_authentication.token = :token', { token })
      .andWhere('email_authentication.type = :type', { type })
      .getOne();
  }

  static async upadteOne(id: string, body: DeepPartial<EmailAuthentication>): Promise<boolean> {
    const result = await this.update(id, body);
    return result.affected === 1 ? true : false;
  }
  // static findByName(firstName: string, lastName: string) {
  //   return this.createQueryBuilder('user')
  //     .where('user.firstName = :firstName', { firstName })
  //     .andWhere('user.lastName = :lastName', { lastName })
  //     .getMany();
  // }
}
