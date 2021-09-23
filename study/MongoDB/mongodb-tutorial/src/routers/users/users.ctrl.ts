import asyncHandler from "express-async-handler";

import { User, Blog } from "../../models";

export const list = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res.send(users);
});

export const create = asyncHandler(async (req, res) => {
  const user = new User(req.body);
  await user.save();
  return res.send({ user });
});

export const read = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.send(user);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { age, name } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(400).send({ err: "user not found" });
  user.age = age;
  user.name = name;
  await Promise.all([
    user.save(),
    Blog.updateMany({ "user._id": id }, { "user.name": name }),
    Blog.updateMany(
      {},
      { "comments.$[comment].userFullName": `${name.first} ${name.last}` },
      { arrayFilters: [{ "comment.user": id }] }
    ),
  ]);

  return res.send(user);
});
