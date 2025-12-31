import { Hono } from "hono";
import { authenticate } from "../../../core/middleware/auth.middleware";
import userController from "../controllers/_user.controller";
import { validate } from "../../../core/utils/validate";
import { updateUserSchema } from "../validation/updateUser.user.validation";
import { updateAccountFiltersSchema } from "../validation/accountFilters.user.validation";

const userRoutes = new Hono();

userRoutes.get("/", authenticate, userController.getUserInfo);

userRoutes.put(
  "/",
  authenticate,
  validate("json", updateUserSchema),
  userController.updateUser
);

userRoutes.put(
  "/account-filters",
  authenticate,
  validate("json", updateAccountFiltersSchema),
  userController.updateFilters
);

// userRoutes.put("/bill-filters", authenticate, userController.updateFilters)

// userRoutes.put("/expense-filters", authenticate, userController.updateFilters)

// userRoutes.put("/savings-filters", authenticate, userController.updateFilters)

// userRoutes.put("/theme", authenticate, userController.updateTheme)

export default userRoutes;
