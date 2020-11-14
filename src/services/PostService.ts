import { DeepPartial, getManager } from 'typeorm';

import Post from '../entity/Post';
import PostImage from '../entity/PostImage';
import Tag from '../entity/Tag';
import User from '../entity/User';

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
  // # 게시물 전체 조회
  async getAllPost(): Promise<ServiceData<Post[]>> {
    try {
      const posts = await Post.createQueryBuilder('post')
        .select(['post', 'user', 'profile', 'tags'])
        .leftJoin('post.user', 'user')
        .leftJoin('post.tags', 'tags')
        .leftJoin('user.profile', 'profile')
        .orderBy({ 'post.created_at': 'DESC' })
        .getMany();
      // const posts = await Test.createQueryBuilder('test').getMany();
      return successData(posts);
    } catch (error) {
      return failureData({ message: '게시물 조회 실패', error });
    }
  }

  // # 게시물 작성
  async write(
    user: User,
    writeForm: { content: string; tags: string[]; images: string[] },
  ): Promise<ServiceData<Post>> {
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
          Post.createOne({ content: writeForm.content, tags, images, userId: user.id }),
        );
      } catch (error) {
        throw new InternalServerError({ message: '게시물 작성 실패', error });
      }
    });
    return successData(post);
  }

  // # 게시물 삭제
  async removeOnePost(postId: string): Promise<ServiceData<boolean>> {
    return successData();
  }

  // # 태그가 존재하는지 찾고 존재하면 가져오고 없으면 새로 생성
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

  // # 이미지 주소 생성
  async createPostImages(imagePaths: string[]): Promise<PostImage[]> {
    const createdPostImages = PostImage.createMany(imagePaths);
    return createdPostImages;
  }

  async test() {
    const post = await Post.findOne({
      where: {
        id: '29ca3e0f-8b95-413a-bd2f-50e5514ade87',
        userId: 'ae3c79bb-e736-4519-bfb0-273117a5aaae',
      },
    });
    console.log(post);
    console.log(await Post.delete('29ca3e0f-8b95-413a-bd2f-50e5514ade87'));
  }
}
export default PostService;
