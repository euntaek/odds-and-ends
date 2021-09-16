import { IBlog, IUser, IComment } from "./src/models";
import axios from "axios";

console.log("Client code running.");

const API_ENDPOINT = "http://localhost:3000";
const client = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 60000,
});

const test = async () => {
  let { data: blogs } = await client.get<IBlog[]>(`/blogs`);

  blogs = await Promise.all(
    blogs.map(async (blog) => {
      const [{ data: user }, { data: comments }] = await Promise.all([
        client.get<IUser>(`/users/${blog.user}`),
        client.get<IComment[]>(`blogs/${blog._id}/comments`),
      ]);
      blog.user = user;
      blog.comments = await Promise.all(
        comments.map(async (comment) => {
          const { data: user } = await client.get(`/users/${comment.user}`);
          comment.user = user;
          return comment;
        })
      );
      return blog;
    })
  );
  console.dir(blogs[45]);
};

test();

process.on("uncaughtException", function (err) {
  console.error("uncaughtException (Node is alive)", err);
});
