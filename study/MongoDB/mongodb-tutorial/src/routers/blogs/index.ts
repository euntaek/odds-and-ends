import { Router } from "express";
import { list, read, create, update, live } from "./blogs.ctrl";

const blogs = Router();

blogs.post("/", create);
blogs.get("/", list);
blogs.get("/:id", read);
blogs.put("/:id", update);
blogs.patch("/:id/live", live);

export default blogs;
