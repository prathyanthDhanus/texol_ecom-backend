import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name must be at most 100 characters",
  }),
  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "Product description is required",
    "string.min": "Product description must be at least 10 characters",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be greater than or equal to 0",
  }),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid category ID")
    .required(),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock must be greater than or equal to 0",
  }),
  images: Joi.array().items(Joi.string()).optional(),
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).optional(),
  description: Joi.string().trim().min(10).optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid category ID")
    .optional(),
  stock: Joi.number().integer().min(0).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  existingImages: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
}).or("name", "description", "price", "category", "stock", "images", "existingImages");