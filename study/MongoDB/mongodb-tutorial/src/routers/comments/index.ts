import { Router } from "express";
import { list, create } from "./comments.ctrl";

const comments = Router({ mergeParams: true });

comments.get("/", list);
comments.post("/", create);

export default comments;
