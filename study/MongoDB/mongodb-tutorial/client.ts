import { IBlog, IUser, IComment } from "./src/models";
import axios from "axios";

//  비효율적인 방법: 13.542s (limit: 15)

console.log("Client code running.");

const API_ENDPOINT = "http://localhost:3000";
const client = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 60000,
});

const test = async () => {
  console.time("loading time: ");
  let { data: blogs } = await client.get<IBlog[]>(`/blogs`);
  console.log(blogs.length);
  console.timeEnd("loading time: ");
};

test();

process.on("uncaughtException", function (err) {
  console.error("uncaughtException (Node is alive)", err);
});
