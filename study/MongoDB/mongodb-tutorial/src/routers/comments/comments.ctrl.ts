import asyncHandler from "express-async-handler";
import { Comment, IComment, Blog, User } from "@src/models";
import { Types } from "mongoose";

type ReqComment = { userId: string } & Omit<IComment, "user" | "blog">;

export const create = asyncHandler(async (req, res) => {
  try {
    console.log("comment");
    const { blogId } = req.params;
    const { userId, content } = req.body as ReqComment;
    const promises = [User.findById(userId), Blog.findById(blogId)] as const;
    const [user, blog] = await Promise.all(promises);

    if (!user || !blog) return res.status(400);

    const comment = new Comment({
      user,
      blog,
      content,
      userFullName: `${user.name.first} ${user.name.last}`,
    });

    await Promise.all([
      comment.save(),
      Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
    ]);

    return res.send(comment);
  } catch (error) {
    return res.status(400).send({ err: "user or blog does not exist" });
  }
});

export const list = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId });
    return res.send(comments);
  } catch (error) {
    return res.status(400).send({ err: "user or blog does not exist" });
  }
});

export const update = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const [comment, _] = await Promise.all([
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
