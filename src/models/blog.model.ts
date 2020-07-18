import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface BlogDB extends mongoose.Document {
  title: string;
  author: string;
  url: string;
  likes: number;
  user: object;
}

export enum LikesManipulation {
  increase = "+1",
  decrease = "-1",
}

export interface BlogAfterMiddleware {
  title: BlogDB["title"];
  author: BlogDB["author"];
  url: BlogDB["url"];
  likes: BlogDB["likes"];
  username: IUser["username"] | LikesManipulation;
  userID: string;
  validated: boolean;
}

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

blogSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret._id;
  },
});

const Blog = mongoose.model<BlogDB>("Blog", blogSchema);

export default Blog;
