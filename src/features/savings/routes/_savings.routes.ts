import { Hono } from "hono";
import { authenticate } from "../../../core/middleware/auth.middleware";
import validateObjectId from "../../../core/middleware/validateObjectId.middleware";
import savingsController from "../controllers/_savings.controller";
import { validate } from "../../../core/utils/validate";
import { savingsSchema } from "../validation/savings.validation";
import { reorderRecurringItemsSchema } from "../../shared/recurring-items/validation/reorder.validation";

const savingsRoutes = new Hono();

savingsRoutes.get("/", authenticate, savingsController.getSavings);

savingsRoutes.post(
  "/",
  authenticate,
  validate("json", savingsSchema),
  savingsController.addSavings
);

savingsRoutes.put(
  "/reorder",
  authenticate,
  validate("json", reorderRecurringItemsSchema),
  savingsController.reorderSavings
);

savingsRoutes.put(
  "/:savingsId",
  authenticate,
  validateObjectId("savingsId"),
  validate("json", savingsSchema),
  savingsController.editSavings
);

savingsRoutes.delete(
  "/:savingsId",
  authenticate,
  validateObjectId("savingsId"),
  savingsController.deleteSavings
);

export default savingsRoutes;
