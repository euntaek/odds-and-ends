import { DeepPartial, getManager } from 'typeorm';

import Comment from '../entity/Comment';
import Post from '../entity/Post';
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

class CommentService {
  async list(postId: string, pId?: string, refComment?: string): Promise<ServiceData<Comment[]>> {
    try {
      const comments = await Comment.getAll(postId, pId, refComment);
      return successData(comments);
    } catch (error) {
      throw new InternalServerError({ message: '댓글 조회 실패', error });
    }
  }
  async test(): Promise<any> {
    const data = await Comment.findAndCount({ postId: '0179a568-325f-422d-9956-9a98dab9232b' });

    return data;
  }
}

export default CommentService;
