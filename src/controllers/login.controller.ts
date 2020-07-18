import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express, { json } from "express";
import User, { IUser } from "../models/user.model";
import config from "../utils/config";
import error from "../utils/error";

const loginRouter = express.Router();

loginRouter.post("/login", async (req, res, next) => {
  try {
    const body = req.body;

    const user = (await User.findOne({ username: body.username })) as IUser;
    const passwordValidation =
      user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && passwordValidation))
      throw new error.ValidationError("invalid username or password");

    const userForToken: IUserForToken = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(userForToken, config.tokenSecret);

    res.json({ token, username: user.username, displayName: user.displayName });
  } catch (e) {
    next(e);
  }
});

loginRouter.get("/validate", (req, res, next) => {
  if (req.body.validated) res.status(200).end();
  else throw new error.ValidationError("Invalid token");
});

export default loginRouter;

export interface IUserForToken {
  username: string;
  id: string;
}
