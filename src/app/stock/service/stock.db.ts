import { Types } from "mongoose";
import Product from "../../product/model/product.model";
import StockHistory from "../model/stockHistory.model";
import AppError from "../../../utils/customError/AppError";
import { SocketEvents } from "../../../utils/soket";

// Types
interface UpdateStockParams {
  productId: string;
  stock: number;
  threshold?: number;
}

interface SetThresholdParams {
  productId: string;
  threshold: number;
}

interface BulkUpdateParams {
  stockUpdates: {
    productId: string;
    stock: number;
    threshold?: number;
  }[];
}

// ・・・・・・・・・・・・・・・  Get Stock Report ・・・・・・・・・・・・・・・

// 📌
export const getStockReportDb = async () => {
  const [totalProducts, inStockProducts, lowStockProducts, outOfStockProducts] =
    await Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Product.countDocuments({ stock: { $gt: 0 }, isDeleted: false }),
      Product.countDocuments({
        stock: { $gt: 0, $lte: { $ref: "lowStockThreshold" } },
        isDeleted: false,
      }),
      Product.countDocuments({ stock: 0, isDeleted: false }),
    ]);

  const totalValue = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
      },
    },
  ]);

  return {
    summary: {
      totalProducts,
      inStockProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue: totalValue[0]?.totalValue || 0,
    },
    timestamp: new Date(),
  };
};

// ・・・・・・・・・・・・・・・  Get Products By Stock Status ・・・・・・・・・・・・・・・

// 📌
export const getProductsByStockStatusDb = async (
  status: "in-stock" | "low-stock" | "out-of-stock"
) => {
  let filter: any = { isDeleted: false };

  switch (status) {
    case "in-stock":
      filter.stock = { $gt: 0 };
      break;
    case "low-stock":
      filter.stock = { $gt: 0, $lte: { $ref: "lowStockThreshold" } };
      break;
    case "out-of-stock":
      filter.stock = 0;
      break;
  }

  return await Product.find(filter)
    .select("name price stock lowStockThreshold images category")
    .populate("category", "name")
    .sort({ stock: 1 });
};

// ・・・・・・・・・・・・・・・  Get Low Stock Products ・・・・・・・・・・・・・・・

// 📌
export const getLowStockProductsDb = async () => {
  return await Product.find({
    stock: { $gt: 0, $lte: { $ref: "lowStockThreshold" } },
    isDeleted: false,
  })
    .select("name price stock lowStockThreshold images category")
    .populate("category", "name")
    .sort({ stock: 1 });
};

// ・・・・・・・・・・・・・・・  Get Out Of Stock Products ・・・・・・・・・・・・・・・

// 📌
export const getOutOfStockProductsDb = async () => {
  return await Product.find({
    stock: 0,
    isDeleted: false,
  })
    .select("name price stock lowStockThreshold images category")
    .populate("category", "name")
    .sort({ name: 1 });
};

// ・・・・・・・・・・・・・・・  Update Product Stock ・・・・・・・・・・・・・・・

// 📌
export const updateProductStockDb = async (
  params: UpdateStockParams,
  userId: string,
  io: any
) => {
  const { productId, stock, threshold } = params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(
      "Product not found",
      "The specified product does not exist",
      404
    );
  }

  const previousStock = product.stock;
  const changeAmount = stock - previousStock;
  const changeType =
    changeAmount > 0 ? "increase" : changeAmount < 0 ? "decrease" : "set";

  // Update product stock
  const updateData: any = { stock };
  if (threshold !== undefined) {
    updateData.lowStockThreshold = threshold;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw new AppError(
      "Failed to update product stock",
      "Database update failed",
      500
    );
  }

  // Record stock history
  await StockHistory.create({
    productId: new Types.ObjectId(productId),
    previousStock,
    newStock: stock,
    changeAmount: Math.abs(changeAmount),
    changeType,
    reason: "manual_update",
    performedBy: new Types.ObjectId(userId),
  });

  // Emit real-time updates
  if (io) {
    SocketEvents.emitInventoryUpdate(io, updatedProduct);

    // Emit stock alert if stock is low
    if (updatedProduct.stock <= updatedProduct.lowStockThreshold) {
      SocketEvents.emitStockAlert(io, {
        productId: updatedProduct._id,
        productName: updatedProduct.name,
        currentStock: updatedProduct.stock,
        threshold: updatedProduct.lowStockThreshold,
        alertType: updatedProduct.stock === 0 ? "out_of_stock" : "low_stock",
      });
    }
  }

  return updatedProduct;
};

// ・・・・・・・・・・・・・・・  Set Stock Threshold ・・・・・・・・・・・・・・・

// 📌
export const setStockThresholdDb = async (
  params: SetThresholdParams,
  io: any
) => {
  const { productId, threshold } = params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(
      "Product not found",
      "The specified product does not exist",
      404
    );
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { lowStockThreshold: threshold },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw new AppError(
      "Failed to update product threshold",
      "Database update failed",
      500
    );
  }

  // Emit real-time updates
  if (io) {
    SocketEvents.emitInventoryUpdate(io, updatedProduct);
  }

  return updatedProduct;
};

// ・・・・・・・・・・・・・・・  Bulk Update Stock ・・・・・・・・・・・・・・・

// 📌
export const bulkUpdateStockDb = async (
  params: BulkUpdateParams,
  userId: string,
  io: any
) => {
  const { stockUpdates } = params;
  const updatedProducts = [];

  for (const update of stockUpdates) {
    const product = await Product.findById(update.productId);
    if (!product) {
      continue; // Skip if product not found
    }

    const previousStock = product.stock;
    const changeAmount = update.stock - previousStock;
    const changeType =
      changeAmount > 0 ? "increase" : changeAmount < 0 ? "decrease" : "set";

    // Update product
    const updateData: any = { stock: update.stock };
    if (update.threshold !== undefined) {
      updateData.lowStockThreshold = update.threshold;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      update.productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (updatedProduct) {
      // Record stock history
      await StockHistory.create({
        productId: new Types.ObjectId(update.productId),
        previousStock,
        newStock: update.stock,
        changeAmount: Math.abs(changeAmount),
        changeType,
        reason: "manual_update",
        performedBy: new Types.ObjectId(userId),
      });

      updatedProducts.push(updatedProduct);

      // Emit real-time updates
      if (io) {
        SocketEvents.emitInventoryUpdate(io, updatedProduct);
      }
    }
  }

  return updatedProducts;
};

// ・・・・・・・・・・・・・・・  Get Stock History ・・・・・・・・・・・・・・・

// 📌
export const getStockHistoryDb = async (
  productId: string,
  days: number = 30
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(
      "Product not found",
      "The specified product does not exist",
      404
    );
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const history = await StockHistory.find({
    productId: new Types.ObjectId(productId),
    timestamp: { $gte: startDate },
  })
    .populate("performedBy", "username email")
    .sort({ timestamp: -1 })
    .limit(100);

  return {
    product: {
      _id: product._id,
      name: product.name,
      currentStock: product.stock,
      threshold: product.lowStockThreshold,
    },
    history,
    period: `${days} days`,
  };
};

// ・・・・・・・・・・・・・・・  Trigger Stock Monitoring ・・・・・・・・・・・・・・・

// 📌
export const monitorStockLevelsDb = async (io: any) => {
  const lowStockProducts = await Product.find({
    stock: { $gt: 0, $lte: { $ref: "lowStockThreshold" } },
    isDeleted: false,
  });

  const outOfStockProducts = await Product.find({
    stock: 0,
    isDeleted: false,
  });

  const alerts = [];

  // Generate low stock alerts
  for (const product of lowStockProducts) {
    alerts.push({
      type: "low_stock",
      productId: product._id,
      productName: product.name,
      currentStock: product.stock,
      threshold: product.lowStockThreshold,
      severity: "warning",
    });
  }

  // Generate out of stock alerts
  for (const product of outOfStockProducts) {
    alerts.push({
      type: "out_of_stock",
      productId: product._id,
      productName: product.name,
      currentStock: product.stock,
      threshold: product.lowStockThreshold,
      severity: "critical",
    });
  }

  // Emit alerts
  if (io && alerts.length > 0) {
    SocketEvents.emitStockAlert(io, {
      alerts,
      totalAlerts: alerts.length,
      timestamp: new Date(),
    });
  }

  return {
    totalAlerts: alerts.length,
    lowStockCount: lowStockProducts.length,
    outOfStockCount: outOfStockProducts.length,
    alerts,
  };
};
