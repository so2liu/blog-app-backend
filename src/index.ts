import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import config from "./utils/config";

http.createServer(app).listen(config.port, () => {
  console.log(`
++++++++
Server running on port ${config.port}
  `);
});
