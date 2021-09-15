import { Router } from "express";
import { list, create } from "./users.ctrl";

const users = Router();

users.get("/", list);
users.post("/", create);

export default users;
