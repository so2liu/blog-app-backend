require("dotenv").config();
import supertest from "supertest";
import app from "../../src/app";

const api = supertest(app);

const EndPoint = "/api/auth/login";
const BlogEndPoint = "/api/blogs";

describe("login / logout", () => {
  test("should receive json with token", async () => {
    const loginInfo = { username: "usrname", password: "pwd" };
    const res = await api.post(EndPoint).send(loginInfo);
    expect(typeof res.body.token).toBe("string");
  });

  test("should get 401 for invalid token", async () => {
    const res = await api
      .post(BlogEndPoint)
      .set("Authorization", "bearer " + "invalid token")
      .send({})
      .expect(401);
  });
});
