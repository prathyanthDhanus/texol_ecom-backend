import express, { RequestHandler } from "express";
import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import { orderSchema, orderUpdateSchema } from "./order.validator";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "./service/order.controller";
import { authorize } from "../../utils/middleware/jwt";
import {
  mapRoutesToRouterWithUploads,
  RouteDefinitionWithUploads,
} from "../../utils/helper/mapRoutesToRouter";

const router = express.Router();

// Role specific middlewares
const adminOnly = authorize(["admin"]);
const adminAndUser = authorize(["user", "admin"]);

// Route definitions
const routes: RouteDefinitionWithUploads[] = [
  {
    method: "post",
    path: "/",
    roles: adminAndUser,
    validator: orderSchema,
    handler: createOrder as unknown as RequestHandler,
  },
  {
    method: "get",
    path: "/",
    roles: adminAndUser,
    handler: getOrders as unknown as RequestHandler,
  },
  {
    method: "get",
    path: "/:orderId",
    roles: adminAndUser,
    handler: getOrder as unknown as RequestHandler,
  },
  {
    method: "put",
    path: "/:orderId",
    roles: adminOnly,
    validator: orderUpdateSchema,
    handler: updateOrder as unknown as RequestHandler,
  },
  {
    method: "delete",
    path: "/:orderId",
    roles: adminOnly,
    handler: deleteOrder as unknown as RequestHandler,
  },
];

//🎯
mapRoutesToRouterWithUploads(router, routes, validateAndHandle);

export const Order_Router = router;
export default Order_Router;
