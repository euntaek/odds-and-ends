import asyncHandler from "express-async-handler";

import { User } from "../../models";

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
