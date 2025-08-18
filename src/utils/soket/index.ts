import { Server } from "socket.io";
import { SocketMiddleware } from "./middleware";
import { IOrder } from "../../app/order/model/order.model";
import { IProduct } from "../../app/product/model/product.model";

export const initializeSocket = (io: Server) => {
  io.use(SocketMiddleware);

  io.on("connection", (socket) => {
  

    // Join room for admin notifications
    if (socket.data.isAdmin) {
      socket.join("admin-room");

    }

    // Join user-specific room for order updates
    if (socket.data.userId) {
      socket.join(`user-${socket.data.userId}`);

    }

    // Handle client events
    socket.on("join-room", (room: string) => {
      socket.join(room);
  
    });

    socket.on("leave-room", (room: string) => {
      socket.leave(room);
  
    });

    socket.on("disconnect", () => {
  
    });
  });

  return io;
};

// Utility functions to emit events
export const SocketEvents = {
  emitNewOrder: (io: Server, order: IOrder) => {
    io.to("admin-room").emit("new-order", {
      type: "new-order",
      order: order,
      timestamp: new Date().toISOString()
    });
  },
  emitInventoryUpdate: (io: Server, product: IProduct) => {
    io.emit("inventory-update", {
      type: "inventory-update",
      productId: product._id,
      stock: product.stock,
      name: product.name,
      stockStatus: product.stockStatus,
      timestamp: new Date().toISOString()
    });
  },
  emitProductDeleted: (io: Server, product: IProduct) => {
    io.emit("product-deleted", {
      type: "product-deleted",
      productId: product._id,
      name: product.name,
      timestamp: new Date().toISOString()
    });
  },
  emitOrderStatusUpdate: (io: Server, order: IOrder) => {
    io.to(`user-${order.user}`).emit("order-status-update", {
      type: "order-status-update",
      order: order,
      timestamp: new Date().toISOString()
    });
    io.to("admin-room").emit("order-updated", {
      type: "order-updated",
      order: order,
      timestamp: new Date().toISOString()
    });
  },
  emitStockAlert: (io: Server, alert: any) => {
    io.to("admin-room").emit("stock-alert", {
      type: "stock-alert",
      alert: alert,
      timestamp: new Date().toISOString()
    });
  },
  emitStockReport: (io: Server, report: any) => {
    io.to("admin-room").emit("stock-report", {
      type: "stock-report",
      report: report,
      timestamp: new Date().toISOString()
    });
  }
};