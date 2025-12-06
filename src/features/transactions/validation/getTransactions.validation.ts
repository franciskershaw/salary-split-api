import Joi from "joi";

const getTransactionsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number.",
    "number.integer": "Page must be a whole number.",
    "number.min": "Page must be at least 1.",
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.base": "Limit must be a number.",
    "number.integer": "Limit must be a whole number.",
    "number.min": "Limit must be at least 1.",
    "number.max": "Limit cannot exceed 100.",
  }),
  sortBy: Joi.string().valid("date", "createdAt").default("date").messages({
    "string.base": "Sort by must be a string.",
    "any.only": "Sort by must be either 'date' or 'createdAt'.",
  }),
  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "string.base": "Sort order must be a string.",
    "any.only": "Sort order must be either 'asc' or 'desc'.",
  }),
  accountId: Joi.string().optional().messages({
    "string.base": "Account ID must be a string.",
  }),
  categories: Joi.string().optional().messages({
    "string.base": "Categories must be a comma-separated string.",
  }),
  type: Joi.string()
    .valid("income", "expense", "transfer")
    .optional()
    .messages({
      "string.base": "Type must be a string.",
      "any.only": "Type must be one of: income, expense, or transfer.",
    }),
  startDate: Joi.date().optional().messages({
    "date.base": "Start date must be a valid date.",
  }),
  endDate: Joi.date().optional().messages({
    "date.base": "End date must be a valid date.",
  }),
  minAmount: Joi.number().optional().messages({
    "number.base": "Minimum amount must be a number.",
  }),
  maxAmount: Joi.number().optional().messages({
    "number.base": "Maximum amount must be a number.",
  }),
});

export default getTransactionsQuerySchema;
