import joi from "joi";

const updateSalarySchema = joi.object({
  salary: joi.number().required().min(0).max(1000000).precision(2).messages({
    "number.base": "Salary must be a number.",
    "number.min": "Salary cannot be negative.",
    "number.max": "Salary cannot exceed 1,000,000.",
    "number.precision": "Salary can only have up to 2 decimal places.",
    "any.required": "Salary is required.",
  }),
});

export default updateSalarySchema;
