import express from "express";
import Blog from "../models/blog.model";
import error from "../utils/error";
import User, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import config from "../utils/config";
import { IUserForToken } from "./login.controller";
import requestParse from "../utils/requestParse";

const blogsRouter = express.Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate("user");
    res.json(blogs);
  } catch (e) {
    next(e);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.validated) throw new error.PropertyRequiredError("token");

    const newBlog = requestParse.toNewBlog(body);

    const user = (await User.findById(newBlog.userID)) as IUser;
    if (!user)
      throw new error.ValidationError(
        `User with userID ${newBlog.userID} is not found`
      );

    newBlog.likes = newBlog.likes ?? 0;

    const blog = new Blog({ ...newBlog, user: user._id });
    const savedBlog = await blog.save();

    if (!user.blogs.includes(savedBlog._id)) {
      user.blogs.push(savedBlog._id);
      await user.save();
    }

    res.status(201).json(savedBlog);
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);

    const user = (await User.findById(deleted.user)) as IUser;
    user.blogs = user.blogs.filter(
      (b) => b.toString() !== deleted._id.toString()
    );
    await user.save();

    res.json(deleted);
  } catch (e) {
    next(e);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  const likes = req.body.likes;
  try {
    if (typeof likes === "string" && !["+1", "-1"].includes(likes))
      throw TypeError(`Unknown value for likes: ${likes}`);

    const id = req.params.id;
    const found = await Blog.findById(id);
    if (req.body?.likes === "+1")
      await found.update({ ...req.body, likes: found.likes + 1 });
    else if (req.body?.likes === "-1")
      await found.update({
        ...req.body,
        likes: Math.max(found.likes - 1, 0),
      });
    else await found.update(req.body);

    const after = await Blog.findById(id);
    res.json(after);
  } catch (e) {
    next(e);
  }
});

export default blogsRouter;

function getTokenFrom(request: express.Request) {
  const authorization = request.get("authorization");
  if (authorization?.toLowerCase().startsWith("bearer "))
    return authorization.substring(7);
  return null;
}
