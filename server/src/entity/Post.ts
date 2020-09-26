import {
  BaseEntity,
  Entity,
  ObjectIdColumn,
  CreateDateColumn,
  Column,
  DeepPartial,
  DeleteDateColumn,
} from 'typeorm';
import { ObjectID } from 'mongodb';
import { InternalServerError } from '../errors/errRequest';

@Entity()
export default class Post extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  tags: string[];

  @CreateDateColumn()
  publishedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date | null;

  static async getAll(skip: number, take: number): Promise<[Post[], number]> {
    try {
      return await this.findAndCount({
        skip,
        take,
        order: { publishedDate: 'DESC' },
        where: {
          ...{},
          deletedDate: null,
        },
      });
    } catch (error) {
      throw new InternalServerError({ location: 'PostModel.getOneById', log: error });
    }
  }
  static async getOneById(id: string): Promise<Post | undefined> {
    try {
      return await this.findOne(id, { where: { deletedDate: null } });
    } catch (error) {
      throw new InternalServerError({ location: 'PostModel.getOneById', log: error });
    }
  }
  static async getManyByIds(ids: ObjectID[]): Promise<Post[] | undefined> {
    try {
      return await this.findByIds(ids, { where: { deletedDate: null } });
    } catch (error) {
      throw new InternalServerError({ location: 'PostModel.getManyByIds', log: error });
    }
  }
  static async createOne(post: DeepPartial<Post>): Promise<Post> {
    try {
      return await this.create(post).save();
    } catch (error) {
      throw new InternalServerError({ location: 'PostModel.createOne', log: error });
    }
  }
  static async removeOne(post: Post): Promise<Post> {
    try {
      return await this.softRemove(post);
    } catch (error) {
      throw new InternalServerError({ location: 'PostModel.removeOne', log: error });
    }
  }
  static async removeMany(posts: Post[]): Promise<Post[]> {
    try {
      return await this.softRemove(posts);
    } catch (error) {
      throw new InternalServerError({ location: 'PostModel.removeOne', log: error });
    }
  }
  static async updateOne(id: ObjectID, postBody: DeepPartial<Post>): Promise<void> {
    try {
      const result = await this.update({ _id: id }, postBody);
      console.log(result);
    } catch (error) {
      throw new InternalServerError({ location: 'PostModel.removeOne', log: error });
    }
  }
}
