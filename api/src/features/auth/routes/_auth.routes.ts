import { Hono } from "hono";
import { validate } from "../../../core/utils/validate";
import localRegister from "../controllers/localRegister.controller";
import { localRegisterSchema } from "../validation/localRegister.auth.validation";

const authRoutes = new Hono();

authRoutes.post(
  "/register",
  validate("json", localRegisterSchema),
  localRegister
);

export default authRoutes;
