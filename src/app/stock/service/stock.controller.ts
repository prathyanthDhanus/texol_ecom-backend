import { Request, Response } from "express";
import {
  getStockReportDb,
  getProductsByStockStatusDb,
  getLowStockProductsDb,
  getOutOfStockProductsDb,
  updateProductStockDb,
  setStockThresholdDb,
  bulkUpdateStockDb,
  getStockHistoryDb,
  monitorStockLevelsDb,
} from "./stock.db";

// ・・・・・・・・・・・・・・・  Get Stock Report ・・・・・・・・・・・・・・・

// 📌
export const getStockReport = async (req: Request, res: Response) => {
  const report = await getStockReportDb();

  return res.status(200).json({
    status: "success",
    message: "Stock report generated successfully",
    data: report,
  });
};

// ・・・・・・・・・・・・・・・  Get Products By Stock Status ・・・・・・・・・・・・・・・

// 📌
export const getProductsByStatus = async (req: Request, res: Response) => {
  const { status } = req.params;
  const validStatuses = ["in-stock", "low-stock", "out-of-stock"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      status: "error",
      message:
        "Invalid stock status. Must be one of: in-stock, low-stock, out-of-stock",
    });
  }

  const products = await getProductsByStockStatusDb(status as any);

  return res.status(200).json({
    status: "success",
    message: `${status} products fetched successfully`,
    data: products,
    count: products.length,
  });
};

// ・・・・・・・・・・・・・・・  Get Low Stock Products ・・・・・・・・・・・・・・・

// 📌
export const getLowStockProducts = async (req: Request, res: Response) => {
  const products = await getLowStockProductsDb();

  return res.status(200).json({
    status: "success",
    message: "Low stock products fetched successfully",
    data: products,
    count: products.length,
  });
};

// ・・・・・・・・・・・・・・・  Get Out Of Stock Products ・・・・・・・・・・・・・・・

// 📌
export const getOutOfStockProducts = async (req: Request, res: Response) => {
  const products = await getOutOfStockProductsDb();

  return res.status(200).json({
    status: "success",
    message: "Out of stock products fetched successfully",
    data: products,
    count: products.length,
  });
};

// ・・・・・・・・・・・・・・・  Update Product Stock ・・・・・・・・・・・・・・・

// 📌
export const updateProductStock = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { stock, threshold } = req.body;
  const userId = req.user?.userId;

  if (!productId) {
    return res.status(400).json({
      status: "error",
      message: "Product ID is required",
    });
  }

  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({
      status: "error",
      message: "Stock must be a non-negative number",
    });
  }

  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const io = req.app.get("io");
  const updatedProduct = await updateProductStockDb(
    { productId, stock, threshold },
    userId,
    io
  );

  return res.status(200).json({
    status: "success",
    message: "Product stock updated successfully",
    data: updatedProduct,
  });
};

// ・・・・・・・・・・・・・・・  Set Stock Threshold ・・・・・・・・・・・・・・・

// 📌
export const setStockThreshold = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { threshold } = req.body;

  if (!productId) {
    return res.status(400).json({
      status: "error",
      message: "Product ID is required",
    });
  }

  if (typeof threshold !== "number" || threshold < 0) {
    return res.status(400).json({
      status: "error",
      message: "Threshold must be a non-negative number",
    });
  }

  const io = req.app.get("io");
  const updatedProduct = await setStockThresholdDb(
    { productId, threshold },
    io
  );

  return res.status(200).json({
    status: "success",
    message: "Stock threshold updated successfully",
    data: updatedProduct,
  });
};

// ・・・・・・・・・・・・・・・  Bulk Update Stock ・・・・・・・・・・・・・・・

// 📌
export const bulkUpdateStock = async (req: Request, res: Response) => {
  const { stockUpdates } = req.body;
  const userId = req.user?.userId;

  if (!Array.isArray(stockUpdates)) {
    return res.status(400).json({
      status: "error",
      message: "stockUpdates must be an array",
    });
  }

  // Validate each update
  for (const update of stockUpdates) {
    if (
      !update.productId ||
      typeof update.stock !== "number" ||
      update.stock < 0
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Each update must have productId and stock (non-negative number)",
      });
    }
  }

  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const io = req.app.get("io");
  const updatedProducts = await bulkUpdateStockDb({ stockUpdates }, userId, io);

  return res.status(200).json({
    status: "success",
    message: "Bulk stock update completed successfully",
    data: updatedProducts,
    count: updatedProducts.length,
  });
};

// ・・・・・・・・・・・・・・・  Get Stock History ・・・・・・・・・・・・・・・

// 📌
export const getStockHistory = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { days = 30 } = req.query;

  if (!productId) {
    return res.status(400).json({
      status: "error",
      message: "Product ID is required",
    });
  }

  const history = await getStockHistoryDb(productId, parseInt(days as string));

  return res.status(200).json({
    status: "success",
    message: "Stock history fetched successfully",
    data: history,
  });
};

// ・・・・・・・・・・・・・・・  Trigger Stock Monitoring ・・・・・・・・・・・・・・・

// 📌
export const triggerStockMonitoring = async (req: Request, res: Response) => {
  const io = req.app.get("io");
  await monitorStockLevelsDb(io);

  return res.status(200).json({
    status: "success",
    message: "Stock monitoring triggered successfully",
  });
};
