import { Schema, model, Types, PopulatedDoc } from "mongoose";
import { IUser } from "./User";
import { CommentSchema, IComment } from "./Comment";

interface IBlog {
  _id: Types.ObjectId;
  title: string;
  content: string;
  isLive: boolean;
  user: PopulatedDoc<IUser>;
  comments: [PopulatedDoc<IComment>];
}

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    user: {
      _id: { type: Types.ObjectId, required: true, ref: "user" },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    commentsCount: { type: Number, default: 0, required: true },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Blog = model<IBlog>("blog", BlogSchema);

export { IBlog, Blog };
