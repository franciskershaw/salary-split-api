import { Hono } from "hono";
import { authenticate } from "../../../core/middleware/auth.middleware";
import userController from "../controllers/_user.controller";
import { validate } from "../../../core/utils/validate";
import { updateUserSchema } from "../validation/updateUser.user.validation";
import { updateAccountFiltersSchema } from "../validation/accountFilters.user.validation";
import { updateBillFiltersSchema } from "../validation/billFilters.user.validation";
import { updateSalarySchema } from "../validation/salary.user.validation";
import { updateThemeSchema } from "../validation/updateTheme.user.validation";

const userRoutes = new Hono();

userRoutes.get("/", authenticate, userController.getUserInfo);

userRoutes.put(
  "/",
  authenticate,
  validate("json", updateUserSchema),
  userController.updateUser
);

userRoutes.patch(
  "/salary",
  authenticate,
  validate("json", updateSalarySchema),
  userController.updateSalary
);

userRoutes.put(
  "/account-filters",
  authenticate,
  validate("json", updateAccountFiltersSchema),
  userController.updateFilters
);

userRoutes.put(
  "/bill-filters",
  authenticate,
  validate("json", updateBillFiltersSchema),
  userController.updateFilters
);

userRoutes.put(
  "/expense-filters",
  authenticate,
  validate("json", updateBillFiltersSchema),
  userController.updateFilters
);

userRoutes.put(
  "/savings-filters",
  authenticate,
  validate("json", updateBillFiltersSchema),
  userController.updateFilters
);

userRoutes.put(
  "/theme",
  authenticate,
  validate("json", updateThemeSchema),
  userController.updateTheme
);

export default userRoutes;
