import Joi from "joi";

// Add to cart validator
export const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

// Update cart item validator
export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

// Remove from cart validator
export const removeFromCartSchema = Joi.object({
  // No body validation needed for DELETE operations
  // Validation is done via URL parameters
});
