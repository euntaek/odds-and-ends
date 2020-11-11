import { DeepPartial, getManager } from 'typeorm';

import Post from '../entity/Post';
import PostImage from '../entity/PostImage';
import Tag from '../entity/Tag';

import { InternalServerError } from '../errors/errRequest';

// interface IPostService {
//   getAllPost(page: number): Promise<[Post[], number]>;
//   getOnePost(id: string): Promise<Post | undefined>;
//   createOnePost(post: DeepPartial<Post>): Promise<Post>;
//   removeOnePost(id: string): Promise<boolean>;
//   removeManyPost(ids: string[]): Promise<boolean>;
//   updateOnePost(id: string, postBody: DeepPartial<Post>): Promise<boolean>;
// }

function successData<T>(data?: T): ServiceData<T> {
  return { success: true, data };
}
function failureData(error: ErrorParams | string) {
  return typeof error === 'string'
    ? { success: false, error: { message: error } }
    : { success: false, error };
}

class PostService {
  // 게시물 작성
  async write(
    userId: string,
    writeForm: { content: string; tags: string[]; images: string[] },
  ): Promise<any> {
    // 게시물작작성 트래잭션 (post, tag, postImage)
    const post = await getManager().transaction(async transactionalEntityManager => {
      try {
        // 태그 저장
        const tags = await transactionalEntityManager.save(await this.createTags(writeForm.tags));
        // 게시물 이미지 저장
        const images = await transactionalEntityManager.save(
          await this.createPostImages(writeForm.images),
        );
        // 게시물 저장
        return await transactionalEntityManager.save(
          Post.createOne({ user_id: userId, content: writeForm.content, tags, images }),
        );
      } catch (error) {
        throw new InternalServerError({ message: '게시물 작성 실패', error });
      }
    });
    return successData(post);
  }

  // 태그가 존재하는지 찾고 존재하면 가져오고 없으면 새로 생성
  async createTags(tags: string[]): Promise<Tag[]> {
    const createTag = async (tag: string) => {
      const refinedTag = tag.toLowerCase();
      const findTag = await Tag.findOneByName(refinedTag);
      return findTag || Tag.createOne(refinedTag);
    };

    const createTagsPromise = tags.map(tag => createTag(tag));
    const createdTags = await Promise.all(createTagsPromise);
    return createdTags;
  }

  async createPostImages(imagePaths: string[]): Promise<PostImage[]> {
    const createdPostImages = PostImage.createMany(imagePaths);
    return createdPostImages;
  }

  async test() {
    const post = await Post.findOne({
      where: { _id: 'cedd3e66-4901-4e1a-8c79-d2b1df499ede' },
      relations: ['tags', 'images'],
    });
    console.log(post);
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
