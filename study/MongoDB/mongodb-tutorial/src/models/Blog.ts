import { Schema, model, Types, PopulatedDoc, Document } from "mongoose";
import { IUser } from ".";

interface IBlog {
  _id: Types.ObjectId;
  title: string;
  content: string;
  isLive: boolean;
  user: PopulatedDoc<IUser>;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, required: true, default: false },
    user: { type: Types.ObjectId, required: true, ref: "user" },
  },
  { timestamps: true }
);

const Blog = model<IBlog>("blog", BlogSchema);

export { IBlog, Blog };
