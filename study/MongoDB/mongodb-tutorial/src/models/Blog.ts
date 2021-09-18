import { Schema, model, Types, PopulatedDoc, Document } from "mongoose";
import { IComment, IUser, Comment, CommentSchema } from ".";

interface IBlog {
  _id: Types.ObjectId;
  title: string;
  content: string;
  isLive: boolean;
  user: PopulatedDoc<IUser>;
  comments: [PopulatedDoc<IComment>];
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, required: true, default: false },
    user: {
      _id: { type: Types.ObjectId, required: true, ref: "user" },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    comments: [
      new Schema<IComment>(
        {
          content: { type: String, required: true },
          user: { type: Types.ObjectId, required: true, ref: "user" },
          blog: { type: Types.ObjectId, required: true, ref: "blog" },
        },
        { timestamps: true }
      ),
    ],
  },
  { timestamps: true }
);

// {
//   _id: { type: Types.ObjectId, required: true, ref: "comment" },
//   content: { type: String, required: true },
//   user: {
//     _id: { type: Types.ObjectId, required: true, ref: "user" },
//     username: { type: String, required: true },
//     name: {
//       first: { type: String, required: true },
//       last: { type: String, required: true },
//     },
//   },
// },
// BlogSchema.virtual("comments", {
//   ref: "comment",
//   localField: "_id",
//   foreignField: "blog",
// });

// BlogSchema.set("toObject", { virtuals: true });
// BlogSchema.set("toJSON", { virtuals: true });

const Blog = model<IBlog>("blog", BlogSchema);

export { IBlog, Blog };
