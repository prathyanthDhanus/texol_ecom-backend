import express from "express";
import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeFromCartSchema,
} from "./cart.validator";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./service/cart.controller";
import { authorize } from "../../utils/middleware/jwt";

const router = express.Router();

// All cart operations require user authentication
const userAuth = authorize(["user", "admin"]);

router.post(
  "/add",
  userAuth,
  validateAndHandle(addToCartSchema, addToCart)
);

router.get("/", userAuth, getCart);

router.put(
  "/update/:itemId",
  userAuth,
  validateAndHandle(updateCartItemSchema, updateCartItem)
);

router.delete(
  "/remove/:itemId",
  userAuth,
  validateAndHandle(removeFromCartSchema, removeFromCart)
);

router.delete("/clear", userAuth, clearCart);

export const Cart_Router = router;
export default Cart_Router;
