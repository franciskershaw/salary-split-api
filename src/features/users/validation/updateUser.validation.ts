import joi from "joi";
import { CURRENCIES } from "../../../core/utils/constants";

const updateUserSchema = joi.object({
  name: joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
  }),
  salary: joi.number().required().min(0).max(1000000).precision(2).messages({
    "number.base": "Salary must be a number.",
    "number.min": "Salary cannot be negative.",
    "number.max": "Salary cannot exceed 1,000,000.",
    "number.precision": "Salary can only have up to 2 decimal places.",
    "any.required": "Salary is required.",
  }),
  defaultCurrency: joi
    .string()
    .required()
    .valid(...Object.values(CURRENCIES)),
});

export default updateUserSchema;
