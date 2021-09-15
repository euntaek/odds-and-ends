import { Schema, model, Types, PopulatedDoc } from "mongoose";
import { IBlog, IUser } from ".";

export interface IComment {
  content: string;
  user: PopulatedDoc<IUser>;
  blog: PopulatedDoc<IBlog>;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    user: { type: Types.ObjectId, required: true, ref: "user" },
    blog: { type: Types.ObjectId, required: true, ref: "blog" },
  },
  { timestamps: true }
);

export const Comment = model<IComment>("comment", CommentSchema);
