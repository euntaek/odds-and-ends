import { Comment, Post, User } from '@/entity';
import { InternalServerError } from '@/errors/errRequest';

function successData<T>(data?: T): ServiceData<T> {
  return { success: true, data };
}
function failureData(error: ErrorParams | string) {
  return typeof error === 'string'
    ? { success: false, error: { name: error } }
    : { success: false, error };
}

class CommentService {
  async getAllComment(
    postId: string,
    pId?: string,
    refComment?: string,
  ): Promise<ServiceData<Comment[]>> {
    try {
      const comments = await Comment.getAll(postId, pId, refComment);
      return successData(comments);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'GET_ALL_COMMENT_ERROR' });
    }
  }

  async createOneComment(
    user: User,
    writeForm: { postId: string; content: string; refCommentId?: string; replyToId?: string },
  ): Promise<ServiceData<Comment>> {
    try {
      const post = await Post.findOneById(writeForm.postId);
      if (!post)
        return failureData({
          name: 'CREATE_ONE_COMMENT_FAILURE',
          message: '존재하지 않는 게시물입니다.',
        });
      if (writeForm.refCommentId) {
        const refComment = await Comment.findOneById(writeForm.refCommentId);
        if (!refComment || refComment.deletedAt)
          return failureData({
            name: 'CREATE_ONE_COMMENT_FAILURE',
            message: '존재하지 않거나 삭제된 댓글입니다.',
          });
      }
      const comment = await Comment.createOneAndSave({ userId: user.id, ...writeForm });
      return successData(comment);
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'CREATE_ONE_COMMENT_ERROR' });
    }
  }

  async removeOneComment(user: User, commentId: string): Promise<ServiceData> {
    try {
      const comment = await Comment.findOneById(commentId);
      if (!comment || comment.userId !== user.id)
        return failureData({
          name: 'REMOVE_ONE_COMMENT_FAILURE',
          message: !comment ? '존재하지 않거나 삭제된 댓글입니다.' : '자신의 댓글이 아닙니다.',
        });
      await comment.softRemove();
      return successData();
    } catch (error) {
      throw new InternalServerError({ ...error, name: 'REMOVE_ONE_COMMENT_ERROR' });
    }
  }

  async test(): Promise<any> {
    const data = await Comment.findAndCount({ postId: '0179a568-325f-422d-9956-9a98dab9232b' });

    return data;
  }
}

export default CommentService;
