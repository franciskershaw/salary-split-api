import { Hono } from "hono";
import { authenticate } from "../../../core/middleware/auth.middleware";
import userController from "../controllers/_user.controller";

const userRoutes = new Hono();

userRoutes.get("/", authenticate, userController.getUserInfo);

export default userRoutes;
