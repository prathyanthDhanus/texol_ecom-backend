import Joi from "joi";
import mongoose from "mongoose";

// Helper for MongoDB ObjectId validation
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "MongoDB ObjectID Validation");

//=================== Create Order Schema ==================
export const orderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        product: objectId.required().messages({
          "any.required": "Product ID is required",
          "any.invalid": "Invalid Product ID format",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.integer": "Quantity must be an integer",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Products must be an array",
      "array.min": "At least one product is required",
      "any.required": "Products are required",
    }),
  shippingAddress: Joi.string().min(10).required().messages({
    "string.base": "Shipping address must be a string",
    "string.empty": "Shipping address is required",
    "string.min": "Shipping address must be at least 10 characters",
  }),
  paymentMethod: Joi.string()
    .valid("credit_card", "paypal", "bank_transfer", "cash_on_delivery")
    .required()
    .messages({
      "any.only": "Invalid payment method",
      "any.required": "Payment method is required",
    }),
}).options({ abortEarly: false });

//=================== Update Order Schema ==================
export const orderUpdateSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .messages({
      "any.only": "Invalid order status",
    }),
  paymentStatus: Joi.string()
    .valid("pending", "completed", "failed", "refunded")
    .messages({
      "any.only": "Invalid payment status",
    }),
  shippingAddress: Joi.string().min(10).messages({
    "string.base": "Shipping address must be a string",
    "string.min": "Shipping address must be at least 10 characters",
  }),
}).or("status", "paymentStatus", "shippingAddress");
