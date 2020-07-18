import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import blogsRouter from "./controllers/blogs.controller";
import rootRouter from "./controllers/root.controller";
import config from "./utils/config";
import logger from "./utils/logger";
import middleware from "./utils/middleware";
import usersRouter from "./controllers/users.controller";
import loginRouter from "./controllers/login.controller";

mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);

mongoose
  .connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((info) =>
    logger.info(`
MongoDB connected
---------
  `)
  )
  .catch((error) => logger.error("Error Connection @ MongoDB", error.message));

const app = express();

if (process.env.NODE_ENV !== "production") app.use(cors());
app.use(express.static("build"));
app.use(middleware.requestLogger);
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", loginRouter);
app.use("/api", rootRouter);
app.use("*", middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
