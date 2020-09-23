import { DeleteWriteOpResultObject, FindAndModifyWriteOpResultObject, DeepPartial } from 'typeorm';

import { InternalServerError } from '../errors/errRequest';
import PostModel, { Post } from '../models/postModel';

class PostService {
  constructor(private postModel = new PostModel()) {}

  async getAllPost(skip = 0, take = 10): Promise<[Post[], number]> {
    const result = await this.postModel.getAll(skip, take);
    if (result.success) return result.data as [Post[], number];
    throw new InternalServerError({
      location: 'postService/getAllPost',
      error: '게시물 조회(전체) 오류',
      log: result.error,
    });
  }
  async getOnePost(id: string): Promise<Post | undefined> {
    const result = await this.postModel.getOneById(id);
    if (result.success) return result.data;
    throw new InternalServerError({
      location: 'postService/getOneByIdPost',
      error: '게시물 조회(단일, id) 오류',
      log: result.error,
    });
  }

  async createOnePost(postBody: DeepPartial<Post>): Promise<Post> {
    const result = await this.postModel.createOne(postBody);
    if (result.success) return result.data as Post;
    throw new InternalServerError({
      location: 'postService/createOnePost',
      error: '게시물 생성 오류',
      log: result.error,
    });
  }

  async removeOnePost(id: string): Promise<FindAndModifyWriteOpResultObject> {
    const result = await this.postModel.removeOne(id);
    if (result.success && result.data) return result.data;
    throw new InternalServerError({
      location: 'postService/removeOnePost',
      error: '포스트 삭제(단일, id) 오류',
      log: result.error,
    });
  }
  async removeManyPost(ids: string[]): Promise<DeleteWriteOpResultObject['result']> {
    const result = await this.postModel.removeMany(ids);
    if (result.success && result.data) return result.data.result;
    throw new InternalServerError({
      location: 'postService/removeManyPost',
      error: '포스트 삭제(복수, ids) 오류',
      log: result.error,
    });
  }

  async updateOnePost(
    id: string,
    postBody: DeepPartial<Post>,
  ): Promise<FindAndModifyWriteOpResultObject> {
    const result = await this.postModel.updateOne(id, postBody);
    if (result.success && result.data) return result.data;
    throw new InternalServerError({
      location: 'postService/updateOnePost',
      error: '포스트 수정(단일, id) 오류',
      log: result.error,
    });
  }
}

export default PostService;
