import { Request, Response } from "express";
import {
  createOrderDb,
  getOrdersDb,
  getOrderDb,
  updateOrderDb,
  deleteOrderDb,
} from "./order.db";

// ・・・・・・・・・・・・・・・  Create Order ・・・・・・・・・・・・・・・

// 📌
export const createOrder = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const order = await createOrderDb({ ...req.body, user: userId });
  
  // Emit real-time notification for new order
  const io = req.app.get("io");
  if (io) {
    const { SocketEvents } = require("../../../utils/soket");
    SocketEvents.emitNewOrder(io, order);
  }
  
  return res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
};

// ・・・・・・・・・・・・・・・  Get All Orders ・・・・・・・・・・・・・・・

// 📌
export const getOrders = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  
  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  // If user is admin, they can see all orders, otherwise only their own
  const { orders, total, totalPages } = await getOrdersDb(page, limit, userRole === "admin" ? undefined : userId);
  return res.status(200).json({
    status: "success",
    message: "Orders fetched successfully",
    data: orders,
    pagination: {
      total,
      page,
      totalPages,
    },
  });
};

// ・・・・・・・・・・・・・・・  Get A Single Order ・・・・・・・・・・・・・・・

// 📌
export const getOrder = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  const { orderId } = req.params;
  
  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  if (!orderId) {
    return res.status(400).json({
      status: "error",
      message: "Order ID is required",
    });
  }

  const order = await getOrderDb(orderId, userRole === "admin" ? undefined : userId);
  return res.status(200).json({
    status: "success",
    message: "Order fetched successfully",
    data: order,
  });
};

// ・・・・・・・・・・・・・・・  Update An Order  ・・・・・・・・・・・・・・・

// 📌
export const updateOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const updatedOrder = await updateOrderDb({
    orderId,
    ...req.body,
  });

  // Emit real-time notification for order status update
  const io = req.app.get("io");
  if (io) {
    const { SocketEvents } = require("../../../utils/soket");
    SocketEvents.emitOrderStatusUpdate(io, updatedOrder);
  }

  return res.status(200).json({
    status: "success",
    message: "Order updated successfully",
    data: updatedOrder,
  });
};

// ・・・・・・・・・・・・・・・  Delete An Order  ・・・・・・・・・・・・・・・

// 📌
export const deleteOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  if (!orderId) {
    return res.status(400).json({
      status: "error",
      message: "Order ID is required",
    });
  }
  const deletedOrder = await deleteOrderDb(orderId);
  return res.status(200).json({
    status: "success",
    message: "Order deleted successfully",
    data: deletedOrder,
  });
};
