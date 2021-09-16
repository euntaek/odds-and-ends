import asyncHandler from "express-async-handler";
import { Comment, IComment, Blog, User } from "@src/models";

type ReqComment = { userId: string } & Omit<IComment, "user" | "blog">;

export const create = asyncHandler(async (req, res) => {
  try {
    console.log("comment");
    const { blogId } = req.params;
    const { userId, content } = req.body as ReqComment;
    const promises = [User.findById(userId), Blog.findById(blogId)] as const;
    const [user, blog] = await Promise.all(promises);
    const comment = new Comment({ user, blog, content });
    await comment.save();
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
