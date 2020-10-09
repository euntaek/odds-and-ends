import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';

import User from './User';
import Tag from './Tag';
import Comment from './Comment';

@Entity()
export default class Post {
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
  deleted_at!: Date | null;

  @ManyToOne((type) => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ referencedColumnName: '_id' })
  user!: User;

  @OneToMany((type) => Comment, (comment) => comment.posts)
  comments!: string;
  // @OneToMany(type=> )
  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'post_and_tag',
    joinColumn: { referencedColumnName: '_id' },
    inverseJoinColumn: { referencedColumnName: '_id' },
  })
  tags!: Tag[];
}

// static async getAll(skip: number, take: number): Promise<[Post[], number]> {
//   try {
//     return await this.findAndCount({
//       skip,
//       take,
//       order: { publishedDate: 'DESC' },
//       where: {
//         ...{},
//         deletedDate: null,
//       },
//     });
//   } catch (error) {
//     throw new InternalServerError({ location: 'PostModel.getOneById', log: error });
//   }
// }
// static async getOneById(id: string): Promise<Post | undefined> {
//   try {
//     return await this.findOne(id, { where: { deletedDate: null } });
//   } catch (error) {
//     throw new InternalServerError({ location: 'PostModel.getOneById', log: error });
//   }
// }
// static async getManyByIds(ids: ObjectID[]): Promise<Post[] | undefined> {
//   try {
//     return await this.findByIds(ids, { where: { deletedDate: null } });
//   } catch (error) {
//     throw new InternalServerError({ location: 'PostModel.getManyByIds', log: error });
//   }
// }
// static async createOne(post: DeepPartial<Post>): Promise<Post> {
//   try {
//     return await this.create(post).save();
//   } catch (error) {
//     throw new InternalServerError({ location: 'PostModel.createOne', log: error });
//   }
// }
// static async removeOne(post: Post): Promise<Post> {
//   try {
//     return await this.softRemove(post);
//   } catch (error) {
//     throw new InternalServerError({ location: 'PostModel.removeOne', log: error });
//   }
// }
// static async removeMany(posts: Post[]): Promise<Post[]> {
//   try {
//     return await this.softRemove(posts);
//   } catch (error) {
//     throw new InternalServerError({ location: 'PostModel.removeMany', log: error });
//   }
// }
// static async updateOne(id: ObjectID, postBody: DeepPartial<Post>): Promise<void> {
//   try {
//     const result = await this.update({ _id: id }, postBody);
//     console.log(result);
//   } catch (error) {
//     throw new InternalServerError({ location: 'PostModel.updateOne', log: error });
//   }
// }
