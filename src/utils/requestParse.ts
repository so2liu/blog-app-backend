import { BlogAfterMiddleware, LikesManipulation } from "../models/blog.model";
import { isString, isNumber, isBoolean } from "lodash";
import error from "./error";

function toNewBlog(object: any): BlogAfterMiddleware {
  const title = parseString(object.title, "title");
  const author = parseString(object.author, "author");
  const url = parseString(object.url, "url");
  const likes = parseLikes(object.likes, "likes");
  const username = parseString(object.username, "username");
  const userID = parseString(object.userID, "userID");
  const validated = parseBoolean(object.validated, "validated");

  return { title, author, url, username, likes, userID, validated };
}

function parseString(str: any, keyName: string): string {
  if (!str) throw new error.ValidationError(`Missing ${keyName}: ${str}`);
  if (!isString(str))
    throw new TypeError(`Incorrect or missing ${keyName}: ${str}`);
  return str;
}

function parseBoolean(bool: any, keyName: string): boolean {
  if (bool === undefined || !isBoolean(bool))
    throw new TypeError(`Incorrect or missing ${keyName}: ${bool}`);
  return bool;
}

function parseLikes(num: any, keyName: string): number {
  if (!num) return num;
  if (!isNumber(num) && !Object.values(LikesManipulation).includes(num as any))
    throw new TypeError(`Incorrect type ${keyName}: ${num}`);
  return num;
}

const requestParse = { toNewBlog };
export default requestParse;
