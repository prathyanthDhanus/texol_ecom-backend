import express from "express";
import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import {
  updateStockSchema,
  setThresholdSchema,
  bulkUpdateStockSchema,
} from "./stock.validator";
import {
  getStockReport,
  getProductsByStatus,
  getLowStockProducts,
  getOutOfStockProducts,
  updateProductStock,
  setStockThreshold,
  bulkUpdateStock,
  getStockHistory,
  triggerStockMonitoring,
} from "./service/stock.controller";
import { authorize } from "../../utils/middleware/jwt";

const router = express.Router();

// All stock operations require admin authentication
const adminAuth = authorize(["admin"]);

// Stock Reports and Analytics
router.get("/report", adminAuth, getStockReport);
router.get("/status/:status", adminAuth, getProductsByStatus);
router.get("/low-stock", adminAuth, getLowStockProducts);
router.get("/out-of-stock", adminAuth, getOutOfStockProducts);

// Stock Management
router.put(
  "/:productId",
  adminAuth,
  validateAndHandle(updateStockSchema, updateProductStock)
);

router.patch(
  "/:productId/threshold",
  adminAuth,
  validateAndHandle(setThresholdSchema, setStockThreshold)
);

router.post(
  "/bulk-update",
  adminAuth,
  validateAndHandle(bulkUpdateStockSchema, bulkUpdateStock)
);

// Stock History and Monitoring
router.get("/:productId/history", adminAuth, getStockHistory);
router.post("/monitor", adminAuth, triggerStockMonitoring);

export const Stock_Router = router;
export default Stock_Router;
