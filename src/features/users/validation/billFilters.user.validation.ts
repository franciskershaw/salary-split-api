import joi from "joi";
import { BILL_TYPES } from "../../../core/utils/constants";

const updateBillFiltersSchema = joi.array().items(
  joi.object({
    type: joi
      .string()
      .valid(...Object.values(BILL_TYPES))
      .required(),
    enabled: joi.boolean().required(),
  })
);

export default updateBillFiltersSchema;
