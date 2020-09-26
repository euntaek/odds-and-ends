import { DeepPartial, getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import Post from '../entity/Post';

class PostService {
  constructor(private postRepository = getMongoRepository(Post)) {}

  async getAllPost(page: number): Promise<[Post[], number]> {
    const skip = (page - 1) * 15;
    const take = 15;
    return await Post.getAll(skip, take);
  }

  async getOnePost(id: string): Promise<Post | undefined> {
    return await Post.getOneById(id);
  }

  async createOnePost(post: DeepPartial<Post>): Promise<Post> {
    return await Post.createOne(post);
  }

  async removeOnePost(id: string): Promise<boolean> {
    const targetPost = await Post.getOneById(id);
    console.log(targetPost);
    if (targetPost) {
      await Post.removeOne(targetPost);
      return true;
    }
    return false;
  }

  async removeManyPost(ids: string[]): Promise<boolean> {
    const objectIds: ObjectID[] = ids.map((id) => new ObjectID(id));
    const targetPosts = await Post.getManyByIds(objectIds);
    if (targetPosts?.length === ids.length) {
      await Post.removeMany(targetPosts);
      return true;
    }
    return false;
  }

  async updateOnePost(id: string, postBody: DeepPartial<Post>): Promise<boolean> {
    const targetPost = await Post.getOneById(id);

    if (targetPost) {
      await Post.updateOne(targetPost._id, postBody);
      return true;
    }
    return false;
  }
}

export default PostService;
