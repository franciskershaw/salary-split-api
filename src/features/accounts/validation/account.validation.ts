import Joi from "joi";

const accountSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please provide an account name.",
    "any.required": "Account name is required.",
  }),
  amount: Joi.number().default(0).messages({
    "number.base": "Amount must be a number.",
  }),
  acceptsFunds: Joi.boolean().default(true).messages({
    "boolean.base": "Accepts funds must be true or false.",
  }),
  receivesSalary: Joi.boolean().default(false).messages({
    "boolean.base": "Receives salary must be true or false.",
  }),
  type: Joi.string()
    .valid("current", "savings", "investment", "joint")
    .default("current")
    .messages({
      "string.base": "Account type must be a string.",
      "any.only":
        "Account type must be one of: current, savings, investment, or joint.",
    }),
  isDefault: Joi.boolean().default(false).messages({
    "boolean.base": "Default account must be true or false.",
  }),
  institution: Joi.string().allow("").messages({
    "string.base": "Institution must be a string.",
  }),
  targetMonthlyAmount: Joi.object({
    amount: Joi.number().required().messages({
      "number.base": "Target monthly amount must be a number.",
      "any.required":
        "Target monthly amount is required when setting up target monthly amount.",
    }),
    splitBetween: Joi.number().required().min(1).max(10).messages({
      "number.base": "Split between must be a number.",
      "number.min": "Split between must be at least 1 person.",
      "number.max": "Split between cannot exceed 10 people.",
      "any.required":
        "Split between is required when setting up target monthly amount.",
    }),
  })
    .optional()
    .messages({
      "object.base":
        "Target monthly amount must be an object with amount and splitBetween fields.",
    }),
});

export default accountSchema;
