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
  const order = await createOrderDb(req.body);
  return res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
};

// ・・・・・・・・・・・・・・・  Get All Orders ・・・・・・・・・・・・・・・

// 📌
export const getOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const { orders, total, totalPages } = await getOrdersDb(page, limit);
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
  const { orderId } = req.params;
  const order = await getOrderDb(orderId);
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

  if (req.body.status) {
    const io = req.app.get("io");
    io.to(updatedOrder.user._id.toString()).emit(
      "orderStatusUpdated",
      updatedOrder
    );
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
  const deletedOrder = await deleteOrderDb(orderId);
  return res.status(200).json({
    status: "success",
    message: "Order deleted successfully",
    data: deletedOrder,
  });
};
