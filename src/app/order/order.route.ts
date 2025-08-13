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

const router = express.Router();

router.post("/", validateAndHandle(orderSchema, createOrder));
router.get("/", getOrders);
router.get("/:orderId", getOrder);
router.put("/:orderId", validateAndHandle(orderUpdateSchema, updateOrder));
router.delete("/:orderId", deleteOrder);

export const Order_Router = router;
export default Order_Router;
