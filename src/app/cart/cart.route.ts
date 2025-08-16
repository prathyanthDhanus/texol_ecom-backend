import express, { RequestHandler } from "express";
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
import {
  mapRoutesToRouterWithUploads,
  RouteDefinitionWithUploads,
} from "../../utils/helper/mapRoutesToRouter";

const router = express.Router();

// Role specific middlewares
const userAuth = authorize(["user", "admin"]);

// Route definitions
const routes: RouteDefinitionWithUploads[] = [
  {
    method: "post",
    path: "/add",
    roles: userAuth,
    validator: addToCartSchema,
    handler: addToCart as unknown as RequestHandler,
  },
  {
    method: "get",
    path: "/",
    roles: userAuth,
    handler: getCart as unknown as RequestHandler,
  },
  {
    method: "put",
    path: "/update/:itemId",
    roles: userAuth,
    validator: updateCartItemSchema,
    handler: updateCartItem as unknown as RequestHandler,
  },
  {
    method: "delete",
    path: "/remove/:itemId",
    roles: userAuth,
    validator: removeFromCartSchema,
    handler: removeFromCart as unknown as RequestHandler,
  },
  {
    method: "delete",
    path: "/clear",
    roles: userAuth,
    handler: clearCart as unknown as RequestHandler,
  },
];

//🎯
mapRoutesToRouterWithUploads(router, routes, validateAndHandle);

export const Cart_Router = router;
export default Cart_Router;
