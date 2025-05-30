import joi from "joi";
import { ACCOUNT_TYPES } from "../../../core/utils/constants";

const updateAccountFiltersSchema = joi.array().items(
  joi.object({
    type: joi
      .string()
      .valid(...Object.values(ACCOUNT_TYPES))
      .required(),
    enabled: joi.boolean().required(),
  })
);

export default updateAccountFiltersSchema;
