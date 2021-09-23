import { Router } from "express";
import { list, create, read, update } from "./users.ctrl";

const users = Router();

users.get("/", list);
users.post("/", create);
users.get("/:id", read);
users.patch("/:id", update);

export default users;
