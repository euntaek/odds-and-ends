import {
  DeepPartial,
  getMongoRepository,
  FindAndModifyWriteOpResultObject,
  DeleteWriteOpResultObject,
} from 'typeorm';
import { ObjectID } from 'mongodb';

import Post from '../entity/Post';

interface IReturn<P = any> {
  success: boolean;
  error?: any;
  data?: P;
}
type ModelReturn<T = any> = Promise<IReturn<T>>;

const success = (data: any) => ({ success: true, data });
const failure = (error: any) => ({ success: false, error });

class PostModel {
  constructor(private postRepository = getMongoRepository(Post)) {}

  async getAll(): ModelReturn<Post[]> {
    try {
      const data = await this.postRepository.find();
      return success(data);
    } catch (error) {
      return failure(error);
    }
  }
  async getOneById(id: string): ModelReturn<Post | undefined> {
    try {
      const data = await this.postRepository.findOne(id);
      return success(data);
    } catch (error) {
      return failure(error);
    }
  }

  async createOne(post: DeepPartial<Post>): ModelReturn<Post> {
    try {
      const createdPost = await this.postRepository.create(post);
      const data = await this.postRepository.save(createdPost);
      return success(data);
    } catch (error) {
      return failure(error);
    }
  }

  async removeOne(id: string): ModelReturn<FindAndModifyWriteOpResultObject> {
    try {
      const objectId = new ObjectID(id);
      const data = await this.postRepository.findOneAndDelete({ _id: objectId });
      return success(data);
    } catch (error) {
      return failure(error);
    }
  }
  async removeMany(ids: string[]): ModelReturn<DeleteWriteOpResultObject> {
    try {
      const objectIds: ObjectID[] = ids.map((id) => new ObjectID(id));
      const data = await this.postRepository.deleteMany({ _id: { $in: objectIds } });
      return success(data);
    } catch (error) {
      return failure(error);
    }
  }
  async updateOne(
    id: string,
    postBody: DeepPartial<Post>,
  ): ModelReturn<FindAndModifyWriteOpResultObject> {
    try {
      const objectId = new ObjectID(id);
      const data = await this.postRepository.findOneAndUpdate(
        { _id: objectId },
        { $set: postBody },
        { returnOriginal: false },
      );
      return success(data);
    } catch (error) {
      return failure(error);
    }
  }
}

export { Post };
export default PostModel;
