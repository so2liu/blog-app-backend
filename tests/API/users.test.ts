require("dotenv").config();
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../src/app";

let api = supertest(app);

const EndPoint = "/api/users";

const user = {
  username: "testUserName",
  password: "pwd",
  displayName: "Oh My Gosh",
};

afterAll(() => {
  mongoose.connection.close();
});

describe("Test Endpoint: api/users", () => {
  test("should create a user by POST", async () => {
    const postRes = await api.post(EndPoint).send(user);
    expect(postRes.body.id).toBeDefined();
    const deleteRes = await api.delete(`${EndPoint}/${postRes.body.username}`);
    expect(deleteRes.body.id).toBe(postRes.body.id);
  });

  test("should query user by username", async () => {
    const postRes = await api.post(EndPoint).send(user);
    expect(postRes.body.id).toBeDefined();
    const queryRes = await api.get(`${EndPoint}/${user.username}`);
    expect(queryRes.body.id).toBeDefined();
    const deleteRes = await api.delete(`${EndPoint}/${postRes.body.username}`);
    expect(deleteRes.body.id).toBe(postRes.body.id);
  });

  test("should return 400 for reduplicated username", async () => {
    const postRes = await api.post(EndPoint).send(user);
    const postRes2 = await api.post(EndPoint).send(user).expect(400);
    const deleteRes = await api.delete(`${EndPoint}/${postRes.body.username}`);
    expect(deleteRes.body.id).toBe(postRes.body.id);
  });
});
