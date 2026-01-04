import { Hono } from "hono";
import { validate } from "../../../core/utils/validate";
import authController from "../controllers/_auth.controller";
import { localRegisterSchema } from "../validation/localRegister.auth.validation";
import { localLoginSchema } from "../validation/localLogin.auth.validation";
import { googleAuth } from "../controllers/OAuth/google/googleAuth.controller";
import { googleCallback } from "../controllers/OAuth/google/googleCallback.controller";

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

authRoutes.get("/google", googleAuth);
authRoutes.get("/google/callback", googleCallback);

authRoutes.get("/refresh-token", authController.refreshTokens);

export default authRoutes;
