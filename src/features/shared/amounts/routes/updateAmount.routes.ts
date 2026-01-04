import { Hono } from "hono";
import { authenticate } from "../../../../core/middleware/auth.middleware";
import { validate } from "../../../../core/utils/validate";
import { updateAmountSchema } from "../validation/updateAmount.validation";
import updateAmount from "../controllers/updateAmount.controller";
import { validateObjectId } from "../../../../core/middleware/validateObjectId.middleware";

const updateAmountRoutes = new Hono();

updateAmountRoutes.patch(
  "/:feature/:itemId",
  authenticate,
  validateObjectId("itemId"),
  validate("json", updateAmountSchema),
  updateAmount
);

export default updateAmountRoutes;
