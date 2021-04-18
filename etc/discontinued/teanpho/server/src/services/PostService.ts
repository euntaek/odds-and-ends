import { getManager } from 'typeorm';

import { Post, PostImage, Tag, User } from '@/entity';
import { InternalServerError } from '@/errors/errRequest';

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
  async getAllPosts(user?: User, tag?: string, pId?: string): Promise<ServiceData<Post[]>> {
    console.log(user, tag, pId);

    try {
      if (user) {
        // 팔로워 게시물만 검색...
        const posts = await Post.getAll();
        return successData(posts);
      } else {
        const posts = await Post.getAll('', tag, pId);
        return successData(posts);
      }
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'GET_ALL_POST_ERROR' });
    }
  }

  // # 게시물 작성
  async createOnePost(
    user: User,
    writeForm: { content: string; tags: string[]; images: string[] },
  ): Promise<ServiceData<Post>> {
    // 게시물작작성 트래잭션 (post, tag, postImage)
    const createdPost = await getManager().transaction(async transactionalEntityManager => {
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
        const post = await transactionalEntityManager.save(
          Post.createOne({ content: writeForm.content, tags, images, userId: user.id }),
        );
        if (!post) {
          throw new InternalServerError({
            name: 'CREATE_ONE_POST_ERROR',
            message: '게시물 작성 쿼리 실패(리턴 값이 존재하지 않음)',
          });
        }
        return post;
      } catch (error) {
        throw new InternalServerError({ ...error, name: 'CREATE_ONE_POST_ERROR' });
      }
    });
    return successData(createdPost);
  }

  // # 게시물 삭제
  async removeOnePost(user: User, postId: string): Promise<ServiceData<boolean>> {
    try {
      const post = await Post.findOneById(postId);
      if (!post) {
        return failureData({
          name: 'REMOVE_ONE_POST_FAILURE',
          message: '존재하지 않는 게시물입니다.',
        });
      }
      if (post.userId !== user.id) {
        return failureData({
          name: 'REMOVE_ONE_POST_FAILURE',
          message: '자신의 게시물이 아닙니다.',
        });
      }
      await Post.delete({ id: postId });
      return successData();
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'REMOVE_ONE_POST_ERROR' });
    }
  }

  // # 태그가 존재하는지 찾고 존재하면 가져오고 없으면 새로 생성
  async createManyTag(tags: string[]): Promise<Tag[]> {
    try {
      const createTag = async (tag: string) => {
        const refinedTag = tag.toLowerCase();
        const findTag = await Tag.findOneByName(refinedTag);
        return findTag || Tag.createOne(refinedTag);
      };

      const createTagsPromise = tags.map(tag => createTag(tag));
      const createdTags = await Promise.all(createTagsPromise);
      return createdTags;
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'CREATE_MANY_TAG_ERROR' });
    }
  }

  // # 이미지 주소 생성
  async createManyPostImage(imageUrls: string[]): Promise<PostImage[]> {
    try {
      const createdPostImages = PostImage.createMany(imageUrls);
      return createdPostImages;
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'CREATE_MANY_POST_INAGE_URL_ERROR' });
    }
  }

  async test() {
    try {
      const data = await Post.delete({ id: '793f9532-6011-475d-b24d-a38637a8b5b0' });
      return data;
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'POST_SERVICE_TEST_ERROR' });
    }
  }
}
export default PostService;
