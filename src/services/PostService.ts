import { DeepPartial } from 'typeorm';
import Post from '../entity/Post';
import { InternalServerError } from '../errors/errRequest';

interface IPostService {
  getAllPost(page: number): Promise<[Post[], number]>;
  getOnePost(id: string): Promise<Post | undefined>;
  createOnePost(post: DeepPartial<Post>): Promise<Post>;
  removeOnePost(id: string): Promise<boolean>;
  removeManyPost(ids: string[]): Promise<boolean>;
  updateOnePost(id: string, postBody: DeepPartial<Post>): Promise<boolean>;
}

function successData<T>(data?: T): ServiceData<T> {
  return { success: true, data };
}
function failureData(error: ErrorParams | string) {
  return typeof error === 'string'
    ? { success: false, error: { message: error } }
    : { success: false, error };
}

class PostService {
  // # 게시물 조회
  async getAllPost(): Promise<ServiceData<Post[]>> {
    try {
      const posts = await Post.findAllByOptions();
      return successData(posts);
    } catch (error) {
      throw new InternalServerError({ message: '게시물 조회 실패', error });
    }
  }
}

// const PostService: IPostService = {
//   async getAllPost(page) {
//     const skip = (page - 1) * 15;
//     const take = 15;
//     return await Post.getAll(skip, take);
//   },
//   async getOnePost(id) {
//     return await Post.getOneById(id);
//   },
//   async createOnePost(post) {
//     return await Post.createOne(post);
//   },
//   async removeOnePost(id) {
//     const targetPost = await Post.getOneById(id);
//     console.log(targetPost);
//     if (targetPost) {
//       await Post.removeOne(targetPost);
//       return true;
//     }
//     return false;
//   },
//   async removeManyPost(ids) {
//     const objectIds: ObjectID[] = ids.map((id) => new ObjectID(id));
//     const targetPosts = await Post.getManyByIds(objectIds);
//     if (targetPosts?.length === ids.length) {
//       await Post.removeMany(targetPosts);
//       return true;
//     }
//     return false;
//   },
//   async updateOnePost(id, postBody) {
//     const targetPost = await Post.getOneById(id);
//     if (targetPost) {
//       await Post.updateOne(targetPost._id, postBody);
//       return true;
//     }
//     return false;
//   },
// };

export default PostService;
