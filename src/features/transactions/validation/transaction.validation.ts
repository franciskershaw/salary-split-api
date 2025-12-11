import Joi from "joi";

const transactionSplitSchema = Joi.object({
  category: Joi.string().required().messages({
    "string.empty": "Please provide a category ID for the split.",
    "any.required": "Category ID is required for each split.",
  }),
  amount: Joi.number().required().not(0).messages({
    "number.base": "Split amount must be a number.",
    "any.required": "Split amount is required.",
    "any.invalid": "Split amount cannot be zero.",
  }),
  description: Joi.string().allow("").optional().messages({
    "string.base": "Split description must be a string.",
  }),
});

const transactionSchema = Joi.object({
  type: Joi.string()
    .valid("income", "expense", "transfer")
    .required()
    .messages({
      "string.empty": "Please provide a transaction type.",
      "any.required": "Transaction type is required.",
      "any.only":
        "Transaction type must be one of: income, expense, or transfer.",
    }),
  splits: Joi.array().items(transactionSplitSchema).min(1).required().messages({
    "array.base": "Splits must be an array.",
    "array.min": "Transaction must have at least one split.",
    "any.required": "Splits are required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Please provide a description.",
    "any.required": "Description is required.",
  }),
  date: Joi.date().required().messages({
    "date.base": "Date must be a valid date.",
    "any.required": "Date is required.",
  }),
  transferToAccount: Joi.string().when("type", {
    is: "transfer",
    then: Joi.required().messages({
      "string.empty":
        "Transfer destination account is required for transfer transactions.",
      "any.required":
        "Transfer destination account is required for transfer transactions.",
    }),
    otherwise: Joi.optional(),
  }),
});

export default transactionSchema;
