import { Server } from "socket.io";
import { SocketMiddleware } from "./middleware";
import { IOrder } from "../../app/order/model/order.model";
import { IProduct } from "../../app/product/model/product.model";

export const initializeSocket = (io: Server) => {
  io.use(SocketMiddleware);

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join room for admin notifications
    if (socket.data.isAdmin) {
      socket.join("admin-room");
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

// Utility functions to emit events
export const SocketEvents = {
  emitNewOrder: (io: Server, order: IOrder) => {
    io.to("admin-room").emit("new-order", order);
  },
  emitInventoryUpdate: (io: Server, product: IProduct) => {
    io.emit("inventory-update", {
      productId: product._id,
      stock: product.stock,
      name: product.name
    });
  },
  emitOrderStatusUpdate: (io: Server, order: IOrder) => {
    io.to(`user-${order.user}`).emit("order-status-update", order);
    io.to("admin-room").emit("order-updated", order);
  }
};