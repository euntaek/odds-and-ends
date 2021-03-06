import { Schema, model, Types, PopulatedDoc } from "mongoose";
import { IBlog, IUser } from ".";

export interface IComment {
  _id: Types.ObjectId;
  content: string;
  user: PopulatedDoc<IUser>;
  userFullName: string;
  blog: PopulatedDoc<IBlog>;
}

export const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: Types.ObjectId, required: true, ref: "user", index: true },
    userFullName: { type: String, required: true },
    blog: { type: Types.ObjectId, required: true, ref: "blog" },
  },
  { timestamps: true }
);

CommentSchema.index({ blog: 1, createdAt: -1 });

export const Comment = model<IComment>("comment", CommentSchema);
