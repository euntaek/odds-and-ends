import { DeepPartial, getManager } from 'typeorm';

import Post from '../entity/Post';
import PostImage from '../entity/PostImage';
import Tag from '../entity/Tag';
import User from '../entity/User';

import { InternalServerError } from '../errors/errRequest';

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
  async getAllPost(pId?: number): Promise<ServiceData<Post[]>> {
    try {
      const posts = await Post.getAll(pId, 20);
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
        const tags = await transactionalEntityManager.save(
          await this.createManyTag(writeForm.tags),
        );
        // 게시물 이미지 저장
        const images = await transactionalEntityManager.save(
          await this.createManyPostImage(writeForm.images),
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
  async removeOnePost(postId: string, userId: string): Promise<ServiceData<boolean>> {
    try {
      const post = await Post.findOneById(postId);
      console.log('post: ', post);
      if (!post || post.userId !== userId)
        return failureData({
          message: '게시물 삭제 실패',
          error: { post, userId, message: '게시물이 없음 or 자신의 게시물이 아님' },
        });
      await post.remove();
      return successData();
    } catch (error) {
      throw new InternalServerError({ message: '게시물 삭제 실패', error });
    }
  }

  // # 태그가 존재하는지 찾고 존재하면 가져오고 없으면 새로 생성
  async createManyTag(tags: string[]): Promise<Tag[]> {
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
  async createManyPostImage(imagePaths: string[]): Promise<PostImage[]> {
    const createdPostImages = PostImage.createMany(imagePaths);
    return createdPostImages;
  }

  async test() {
    const data = await Post.delete({ id: 'b9141681-8952-4c5e-a2b6-0675095d148b' });
    return data;
  }
}
export default PostService;
