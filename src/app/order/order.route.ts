import express from "express";
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

const router = express.Router();

router.post(
  "/",
  authorize(["user", "admin"]),
  validateAndHandle(orderSchema, createOrder)
);

router.get("/", authorize(["user", "admin"]), getOrders);

router.get("/:orderId", authorize(["user", "admin"]), getOrder);

router.put(
  "/:orderId",
  authorize(["admin"]),
  validateAndHandle(orderUpdateSchema, updateOrder)
);

router.delete("/:orderId", authorize(["admin"]), deleteOrder);

export const Order_Router = router;
export default Order_Router;
