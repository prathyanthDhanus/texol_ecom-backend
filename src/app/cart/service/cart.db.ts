import { Types } from "mongoose";
import Cart from "../model/cart.model";
import Product from "../../product/model/product.model";
import AppError from "../../../utils/customError/AppError";

// ・・・・・・・・・・・・・・・ Add to cart ・・・・・・・・・・・・・・・

// 📌
export const addToCartDb = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  // Validate product exists and has sufficient stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(
      "Product not found",
      "The specified product does not exist",
      404
    );
  }

  if (product.stock === 0) {
    throw new AppError(
      "Product out of stock",
      `Sorry, ${product.name} is currently out of stock`,
      400
    );
  }

  if (product.stock < quantity) {
    throw new AppError(
      "Insufficient stock",
      `Sorry, only ${product.stock} items of ${product.name} are available`,
      400
    );
  }

  // Find or create cart for user
  let cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });

  if (!cart) {
    cart = new Cart({
      userId: new Types.ObjectId(userId),
      items: [],
    });
  }

  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    const existingItem = cart.items[existingItemIndex];
    if (existingItem) {
      existingItem.quantity += quantity;
    }
  } else {
    // Add new item
    const newItem: any = {
      productId: new Types.ObjectId(productId),
      quantity,
      price: product.price,
      name: product.name,
    };

    if (product.images?.[0]) {
      newItem.image = product.images[0];
    }

    cart.items.push(newItem);
  }

  await cart.save();
  return cart;
};

// ・・・・・・・・・・・・・・・ Get cart ・・・・・・・・・・・・・・・

// 📌
export const getCartDb = async (userId: string) => {
  const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) })
    .populate("items.productId", "name price images stock stockStatus lowStockThreshold")
    .lean();

  if (!cart) {
    return {
      userId: new Types.ObjectId(userId),
      items: [],
      totalAmount: 0,
      itemCount: 0,
    };
  }

  return cart;
};

// ・・・・・・・・・・・・・・・ Update cart item ・・・・・・・・・・・・・・・

// 📌
export const updateCartItemDb = async (
  userId: string,
  itemId: string,
  quantity: number
) => {
  const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });
  if (!cart) {
    throw new AppError("Cart not found", "No cart found for this user", 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id?.toString() === itemId
  );

  if (itemIndex === -1) {
    throw new AppError(
      "Item not found",
      "The specified item is not in the cart",
      404
    );
  }

  // Validate stock availability
  const item = cart.items[itemIndex];
  if (!item) {
    throw new AppError(
      "Item not found",
      "The specified item is not in the cart",
      404
    );
  }

  const product = await Product.findById(item.productId);
  if (!product) {
    throw new AppError(
      "Product not found",
      "The product no longer exists",
      404
    );
  }

  if (product.stock === 0) {
    throw new AppError(
      "Product out of stock",
      `Sorry, ${product.name} is currently out of stock`,
      400
    );
  }

  if (product.stock < quantity) {
    throw new AppError(
      "Insufficient stock",
      `Sorry, only ${product.stock} items of ${product.name} are available`,
      400
    );
  }

  item.quantity = quantity;
  await cart.save();

  return cart;
};

// ・・・・・・・・・・・・・・・ Remove from cart ・・・・・・・・・・・・・・・

// 📌
export const removeFromCartDb = async (userId: string, itemId: string) => {
  const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });
  if (!cart) {
    throw new AppError("Cart not found", "No cart found for this user", 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id?.toString() === itemId
  );

  if (itemIndex === -1) {
    throw new AppError(
      "Item not found",
      "The specified item is not in the cart",
      404
    );
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  return cart;
};

// ・・・・・・・・・・・・・・・ Clear cart ・・・・・・・・・・・・・・・

// 📌
export const clearCartDb = async (userId: string) => {
  const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });
  if (!cart) {
    throw new AppError("Cart not found", "No cart found for this user", 404);
  }

  cart.items = [];
  await cart.save();

  return cart;
};
