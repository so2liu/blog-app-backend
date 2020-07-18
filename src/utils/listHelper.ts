import { BlogAfterMiddleware } from "../models/blog.model";
import _ from "lodash";

function dummy(blogs: BlogAfterMiddleware[]) {
  return 1;
}

function totalLikes(blogs: BlogAfterMiddleware[]) {
  return blogs.reduce((pre, cur) => pre + cur.likes, 0);
}

function favoriteBlog(blogs: BlogAfterMiddleware[]) {
  if (blogs.length === 0) return null;

  let favorite = blogs[0];
  blogs.forEach((b) => {
    if (favorite.likes < b.likes) favorite = b;
  });
  const { title, author, likes } = favorite;
  return { title, author, likes };
}

function mostBlogs(blogs: BlogAfterMiddleware[]) {
  if (blogs.length === 0) return null;

  const result = { author: "", blogs: 0 };
  const count = _.countBy(blogs, (blog) => blog.author);
  for (const [author, blogNum] of Object.entries(count)) {
    if (result.blogs < blogNum) {
      result.author = author;
      result.blogs = blogNum;
    }
  }
  return result;
}

function mostLike(blogs: BlogAfterMiddleware[]) {
  if (blogs.length === 0) return null;

  const result = { author: "", likes: 0 };
  const authorWithLikes: { [k: string]: number } = {};
  blogs.forEach((blog) => {
    if (authorWithLikes[blog.author])
      authorWithLikes[blog.author] += blog.likes;
    else authorWithLikes[blog.author] = blog.likes;
  });

  for (const [author, likes] of Object.entries(authorWithLikes)) {
    if (result.likes >= likes) continue;
    result.author = author;
    result.likes = likes;
  }
  return result;
}

export default { dummy, totalLikes, favoriteBlog, mostBlogs, mostLike };
