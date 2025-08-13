import Order, { IOrder } from "../model/order.model";
import Product from "../../product/model/product.model";
import User from "../../auth/model/auth.model";
import AppError from "../../../utils/customError/AppError";

interface OrderDbParams {
  user: string;
  products: {
    product: string;
    quantity: number;
  }[];
  shippingAddress: string;
  paymentMethod: string;
}

interface UpdateOrderParams extends Partial<OrderDbParams> {
  orderId: string;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus?: "pending" | "completed" | "failed" | "refunded";
}

// ・・・・・・・・・・・・・・・  Create Order ・・・・・・・・・・・・・・・

// 📌
export const createOrderDb = async ({
  user,
  products,
  shippingAddress,
  paymentMethod,
}: OrderDbParams): Promise<IOrder> => {
  const userExists = await User.findById(user);
  if (!userExists) {
    throw new AppError(
      "User not found",
      "Resource not found: User does not exist",
      404
    );
  }

  // Process products and calculate total
  let totalAmount = 0;
  const processedProducts = await Promise.all(
    products.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product || product.isDeleted) {
        throw new AppError(
          `Product not found: ${item.product}`,
          "Resource not found: Product does not exist",
          404
        );
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for product: ${product.name}`,
          `Only ${product.stock} items available`,
          400
        );
      }

      totalAmount += product.price * item.quantity;

      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  // Create the order
  const newOrder = new Order({
    user,
    products: processedProducts,
    totalAmount,
    shippingAddress,
    paymentMethod,
    status: "pending",
    paymentStatus: "pending",
  });

  // Update product stocks
  await Promise.all(
    products.map(async (item) => {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    })
  );

  await newOrder.save();
  return newOrder;
};

// ・・・・・・・・・・・・・・・  Get All Orders ・・・・・・・・・・・・・・・

// 📌
export const getOrdersDb = async (
  page: number,
  limit: number
): Promise<{ orders: IOrder[]; total: number; totalPages: number }> => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find()
      .populate("user", "username email")
      .populate("products.product", "name price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(),
  ]);

  return {
    orders,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

// ・・・・・・・・・・・・・・・  Get A Single Order ・・・・・・・・・・・・・・・

// 📌
export const getOrderDb = async (orderId: string): Promise<IOrder> => {
  const order = await Order.findById(orderId)
    .populate("user", "username email")
    .populate("products.product", "name price images");

  if (!order) {
    throw new AppError(
      "Order not found",
      "Resource not found: Order does not exist",
      404
    );
  }

  return order;
};

// ・・・・・・・・・・・・・・・  Update An Order  ・・・・・・・・・・・・・・・

// 📌
export const updateOrderDb = async ({
  orderId,
  ...updateData
}: UpdateOrderParams): Promise<IOrder> => {
  // Validate status transition if updating status
  if (updateData.status) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError(
        "Order not found",
        "Resource not found: Order does not exist",
        404
      );
    }
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("user", "name email")
    .populate("products.product", "name price images");

  if (!updatedOrder) {
    throw new AppError(
      "Order not found",
      "Resource not found: Order does not exist",
      404
    );
  }

  return updatedOrder;
};

// ・・・・・・・・・・・・・・・  Delete An Order  ・・・・・・・・・・・・・・・

// 📌
export const deleteOrderDb = async (orderId: string): Promise<IOrder> => {
  const deletedOrder = await Order.findByIdAndDelete(orderId);

  if (!deletedOrder) {
    throw new AppError(
      "Order not found",
      "Resource not found: Order does not exist",
      404
    );
  }

  // Restore product stock if order is deleted
  await Promise.all(
    deletedOrder.products.map(async (item) => {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    })
  );

  return deletedOrder;
};
