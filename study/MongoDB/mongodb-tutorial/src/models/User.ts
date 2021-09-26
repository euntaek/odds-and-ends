import { Schema, model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  name: { first: string; last: string };
  age?: number;
  email?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    age: { type: Number, index: true },
    email: String,
  },
  { timestamps: true }
);

export const User = model<IUser>("user", UserSchema);
