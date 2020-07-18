import morgan from "morgan";
import express from "express";
import config from "../utils/config";
import { IUserForToken } from "../controllers/login.controller";
import jwt from "jsonwebtoken";
import error from "./error";

const requestLogger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "@",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});

function errorHandler(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log("=========", err.name, err.message);

  switch (err.name) {
    case "CastError":
      return res.status(404).send({ error: err.message });
    case "NotFoundError":
      return res.status(404).send({ error: err.message });
    case "ValidationError":
      return res.status(400).json({ error: err.message });
    case "TypeError":
      return res.status(400).json({ error: err.message });
    case "JsonWebTokenError":
      return res.status(401).json({ error: "invalid token" });
    default:
      next(err);
  }
}

const unknownEndpoint = (req: express.Request, res: express.Response) => {
  res.status(404).send({ error: "Unknown endpoint" });
};

const tokenExtractor = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = getTokenFrom(req);

    if (token) {
      const decodedToken = jwt.verify(
        token,
        config.tokenSecret
      ) as IUserForToken;
      req.body.username = decodedToken.username;
      req.body.userID = decodedToken.id;
      req.body.validated = true;
    }
    next();
  } catch (e) {
    next(e);
  }
};

export default { requestLogger, errorHandler, unknownEndpoint, tokenExtractor };

function getTokenFrom(request: express.Request) {
  const authorization = request.get("Authorization");
  if (authorization?.toLowerCase().startsWith("bearer "))
    return authorization.substring(7);
  return null;
}
