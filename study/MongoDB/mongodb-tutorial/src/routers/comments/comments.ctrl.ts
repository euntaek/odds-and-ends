import { startSession } from "mongoose";
import asyncHandler from "express-async-handler";
import { Comment, IComment, Blog, User } from "@src/models";

type ReqComment = { userId: string } & Omit<IComment, "user" | "blog">;

export const create = asyncHandler(async (req, res) => {
  const session = await startSession();
  let result;
  try {
    const comment = await session.withTransaction(async () => {
      const { blogId } = req.params as { blogId: string };
      const { userId, content } = req.body as ReqComment;
      if (blogId == "1") return res.status(400).send("user | blog ");
      const promises = [
        User.findById(userId, {}, { session }),
        Blog.findById(blogId, {}, { session }),
      ] as const;
      const [user, blog] = await Promise.all(promises);

      if (!user || !blog) return res.status(400).send("user | blog ");

      const comment = new Comment({
        user,
        blog: blogId,
        content,
        userFullName: `${user.name.first} ${user.name.last}`,
      });

      blog.commentsCount++;
      if (blog.commentsCount > 3) blog.comments.shift();

      await Promise.all([comment.save({ session }), blog.save({ session })]);
      result = comment;
    });
    return res.send(result);
  } finally {
    await session.endSession();
  }
});

export const list = asyncHandler(async (req, res) => {
  try {
    const { page = "0" } = req.query as { page: string };

    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .skip(parseInt(page, 10) * 20)
      .limit(20);
    return res.send(comments);
  } catch (error) {
    return res.status(400).send({ err: "comments or blog does not exist" });
  }
});

export const update = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const [comment] = await Promise.all([
    Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
    Blog.updateOne(
      { comments: { $elemMatch: { _id: commentId } } },
      { "comments.$.content": content }
    ),
  ]);
  return res.send(comment);
});

export const test = asyncHandler(async (req, res) => {
  console.log("test");
  const { commentId } = req.params;
  // const id = new Types.ObjectId(commentId);
  // const comment = await Comment.findById(commentId);
  console.log(commentId);
  console.log("=====================================");
  const blog = await Blog.find({
    comments: { $elemMatch: { _id: commentId } },
  });
  // console.log(blog);
  console.log("=====================================");
  const blog2 = await Blog.find({ "comments._id": commentId });

  console.log("=====================================");
  res.send({ blog, blog2 });
});
