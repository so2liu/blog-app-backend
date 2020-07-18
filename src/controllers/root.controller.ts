import express from "express";

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.send(`
  <h1>API Root Entpoint</h1>
  <b>Oh my gosh, Api endpoint is working!</b>
  <p>${new Date().toISOString()}</p>
  `);
});

export default rootRouter;
