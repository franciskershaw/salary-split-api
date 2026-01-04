import Savings from "../model/savings.model";
import { createAddController } from "../../shared/recurring-items/controllers/add.controller";
import { createEditController } from "../../shared/recurring-items/controllers/edit.controller";
import { createDeleteController } from "../../shared/recurring-items/controllers/delete.controller";
import { createGetController } from "../../shared/recurring-items/controllers/get.controller";
import { createReorderController } from "../../shared/reorder/reorder.controller";

const savingsController = {
  addSavings: createAddController(Savings),
  editSavings: createEditController(Savings, "savingsId"),
  deleteSavings: createDeleteController(Savings, "savingsId"),
  getSavings: createGetController(Savings),
  reorderSavings: createReorderController(Savings, "savings"),
};

export default savingsController;
