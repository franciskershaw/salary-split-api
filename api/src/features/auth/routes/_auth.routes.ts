import { Hono } from "hono";
import { validate } from "../../../core/utils/validate";
import authController from "../controllers/_auth.controller";
import { localRegisterSchema } from "../validation/localRegister.auth.validation";
import { localLoginSchema } from "../validation/localLogin.auth.validation";

const authRoutes = new Hono();

authRoutes.post(
  "/register",
  validate("json", localRegisterSchema),
  authController.localRegister
);

authRoutes.post(
  "/login",
  validate("json", localLoginSchema),
  authController.localLogin
);

authRoutes.post("/logout", authController.logout);

export default authRoutes;
