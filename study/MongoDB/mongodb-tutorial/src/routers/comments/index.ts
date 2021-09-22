import { Router } from "express";
import { list, create, update, test } from "./comments.ctrl";

const comments = Router({ mergeParams: true });

comments.get("/", list);
comments.post("/", create);
comments.patch("/:commentId", update);
comments.get("/test/:commentId", test);

export default comments;
