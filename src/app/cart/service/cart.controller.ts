import { Request, Response } from "express";
import {
  addToCartDb,
  getCartDb,
  updateCartItemDb,
  removeFromCartDb,
  clearCartDb,
} from "./cart.db";

// ・・・・・・・・・・・・・・・ Add to cart ・・・・・・・・・・・・・・・

// 📌
export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const { productId, quantity } = req.body;
  const cart = await addToCartDb(userId, productId, quantity);

  return res.status(200).json({
    status: "success",
    message: "Item added to cart successfully",
    data: cart,
  });
};

// ・・・・・・・・・・・・・・・ Get cart ・・・・・・・・・・・・・・・

// 📌
export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const cart = await getCartDb(userId);

  return res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    data: cart,
  });
};

// ・・・・・・・・・・・・・・・ Update cart item ・・・・・・・・・・・・・・・

// 📌
export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!itemId) {
    return res.status(400).json({
      status: "error",
      message: "Item ID is required",
    });
  }

  const cart = await updateCartItemDb(userId, itemId, quantity);

  return res.status(200).json({
    status: "success",
    message: "Cart item updated successfully",
    data: cart,
  });
};

// ・・・・・・・・・・・・・・・ Remove from cart ・・・・・・・・・・・・・・・

// 📌
export const removeFromCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const { itemId } = req.params;
  if (!itemId) {
    return res.status(400).json({
      status: "error",
      message: "Item ID is required",
    });
  }
  const cart = await removeFromCartDb(userId, itemId);

  return res.status(200).json({
    status: "success",
    message: "Item removed from cart successfully",
    data: cart,
  });
};

// ・・・・・・・・・・・・・・・ Clear cart ・・・・・・・・・・・・・・・

// 📌
export const clearCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const cart = await clearCartDb(userId);

  return res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: cart,
  });
};
