import joi from "joi";

const updateThemeSchema = joi.object({
  defaultTheme: joi.string().required().valid("light", "dark"),
});

export default updateThemeSchema;
