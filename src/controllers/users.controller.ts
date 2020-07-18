import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import { Router } from "express";
import config from "../utils/config";
import { IUserForToken } from "./login.controller";
import jwt from "jsonwebtoken";
import error from "../utils/error";

const usersRouter = Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("blogs");
    res.json(users);
  } catch (e) {
    next(e);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;

    const passwordHash = await bcrypt.hash(body.password, config.pwdSalt);

    const user = new User({ ...req.body, passwordHash }) as IUser;

    const savedUser = await user.save();

    const userForToken: IUserForToken = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(userForToken, config.tokenSecret);

    res.json({ ...savedUser.toJSON(), token });
  } catch (e) {
    next(e);
  }
});

usersRouter.delete("/:username", async (req, res, next) => {
  try {
    const deleted = await User.findOneAndDelete({
      username: req.params.username,
    });
    if (!deleted)
      throw new error.NotFoundError(
        `Username ${req.params.username} is not found`
      );
    res.json(deleted);
  } catch (e) {
    next(e);
  }
});

usersRouter.get("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });
    if (!user)
      throw new error.NotFoundError(
        `Username ${req.params.username} is not found`
      );
    res.json(user);
  } catch (e) {
    next(e);
  }
});

export default usersRouter;
