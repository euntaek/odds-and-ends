import { Router } from "express";

import users from "./users";
import blogs from "./blogs";
import comments from "./comments";

const router = Router();

router.use("/users", users);
router.use("/blogs", blogs);
router.use("/blogs/:blogId/comments", comments);

export default router;
