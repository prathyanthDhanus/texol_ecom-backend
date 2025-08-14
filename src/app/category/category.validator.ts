import Joi from "joi";

//=============== Create category schema ==================
export const categorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 3 characters",
    "string.max": "Category name must be at most 50 characters",
  }),
  description: Joi.string().trim().min(5).max(200).required().messages({
    "string.empty": "Category description is required",
    "string.min": "Category description must be at least 5 characters",
    "string.max": "Category description must be at most 200 characters",
  }),
});

//================ Category update schema ==================
export const categoryUpdateSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).optional(),
  description: Joi.string().trim().min(5).max(200).optional(),
  isDeleted: Joi.boolean().optional(),
})
  .or("name", "description", "isDeleted")
  .messages({
    "object.missing": "At least one field must be provided for update",
  });
//================ Category restore schema ==================
export const categoryRestoreSchema = Joi.object({
  isDeleted: Joi.boolean().valid(false).required(),
}).messages({
  "boolean.base": "isDeleted must be a boolean",
  "any.only": "isDeleted must be false for restoration",
  "any.required": "isDeleted is required for restoration",
});
