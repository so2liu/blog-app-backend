require("dotenv").config();
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../src/app";

let api = supertest(app);

const EndPoint = "/api/blogs";
const LoginEndPoint = "/api/auth/login";

let loginToken: string;
beforeAll(async () => {
  const res = await api
    .post(LoginEndPoint)
    .send({ username: "usrname", password: "pwd" });

  loginToken = res.body.token;
});

afterAll(() => {
  mongoose.connection.close();
});

test("should return as json", async () => {
  await api
    .get(EndPoint)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("should get blogs", async () => {
  const res = await api.get(EndPoint);
  expect(res.body.length).toBeDefined();
});

test("should be able to post a blog", async () => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    username: "usrname",
  };
  const getRes = await api.get(EndPoint);

  const postRes = await api
    .post(EndPoint)
    .set("Authorization", "bearer " + loginToken)
    .send(blog);
  expect(postRes.body.id).toBeDefined();
  const deleteRes = await api.delete(`${EndPoint}/${postRes.body.id}`);
  expect(deleteRes.body.id).toBe(postRes.body.id);
  const getResFinal = await api.get(EndPoint);
  expect(getRes.body.length).toBe(getResFinal.body.length);
});

test("should set like = 0 for posted blog without like", async () => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    username: "usrname",
  };

  const postRes = await api
    .post(EndPoint)
    .set("Authorization", "bearer " + loginToken)
    .send(blog);
  expect(postRes.body.likes).toBe(0);
  const deleteRes = await api.delete(`${EndPoint}/${postRes.body.id}`);
  expect(deleteRes.body.id).toBe(postRes.body.id);
});

test("should return 400 Bad Request for blog without title or url", async () => {
  const blog = {
    author: "Michael Chan",
  };

  const postRes = await api
    .post(EndPoint)
    .set("Authorization", "bearer " + loginToken)
    .send(blog)
    .expect(400);
});

test("should can update likes", async () => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    username: "usrname",
  };
  const getRes = await api.get(EndPoint);
  const postRes = await api
    .post(EndPoint)
    .set("Authorization", "bearer " + loginToken)
    .send(blog);
  expect(postRes.body.id).toBeDefined();

  const putRes = await api
    .put(`${EndPoint}/${postRes.body.id}`)
    .send({ likes: "+1" });
  expect(putRes.body.likes).toBe(postRes.body.likes + 1);

  const deleteRes = await api.delete(`${EndPoint}/${postRes.body.id}`);
  expect(deleteRes.body.id).toBe(postRes.body.id);
  const getResFinal = await api.get(EndPoint);
  expect(getRes.body.length).toBe(getResFinal.body.length);
});

test("should return 404 Not Found for unknown ID", async () => {
  const postRes = await api.delete(`${EndPoint}/unknownID`).expect(404);
});
