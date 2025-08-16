import Joi from "joi";

// Update stock validator
export const updateStockSchema = Joi.object({
  stock: Joi.number().integer().min(0).required(),
  threshold: Joi.number().integer().min(0).optional(),
});

// Set threshold validator
export const setThresholdSchema = Joi.object({
  threshold: Joi.number().integer().min(0).required(),
});

// Bulk update stock validator
export const bulkUpdateStockSchema = Joi.object({
  stockUpdates: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      stock: Joi.number().integer().min(0).required(),
      threshold: Joi.number().integer().min(0).optional(),
    })
  ).min(1).required(),
});
