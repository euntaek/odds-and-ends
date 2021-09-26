import asyncHandler from "express-async-handler";
import { Blog, User, IBlog, IUser, Comment } from "@src/models";

type ReqBlog = { userId: string } & Omit<IBlog, "user">;

export const create = asyncHandler(async (req, res) => {
  const { title, content, isLive, userId } = req.body as ReqBlog;
  console.log("create");
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ err: "user does not exist" });
  console.log(user);
  const blog = new Blog({ title, content, isLive });
  blog.user = user;
  await blog.save();
  return res.send(blog);
});

export const list = asyncHandler(async (req, res) => {
  const { page = "0" } = req.query as { page: string };
  const blogs = await Blog.find()
    .sort({ updatedAt: -1 })
    .skip(parseInt(page, 10) * 3)
    .limit(3);

  return res.send(blogs);
});

export const read = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  // const commentCount = await Comment.find({
  //   blog: req.params.id,
  // }).countDocuments();
  if (!blog) return res.status(400).send({ err: "blog does not exist" });
  return res.send(blog);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body as ReqBlog;
  const blog = await Blog.findOneAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  );
  return res.send(blog);
});

export const live = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { isLive } = req.body as { isLive: boolean };
  const blog = await Blog.findOneAndUpdate(
    { _id: id },
    { isLive },
    { new: true }
  );
  return res.send(blog);
});
