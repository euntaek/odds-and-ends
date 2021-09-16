import { Router } from "express";
import { list, create, read } from "./users.ctrl";

const users = Router();

users.get("/", list);
users.post("/", create);
users.get("/:id", read);

export default users;
