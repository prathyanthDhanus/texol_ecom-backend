import express, { RequestHandler } from "express";
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
import {
  mapRoutesToRouterWithUploads,
  RouteDefinitionWithUploads,
} from "../../utils/helper/mapRoutesToRouter";

const router = express.Router();

// Role specific middlewares
const adminOnly = authorize(["admin"]);

// Route definitions
const routes: RouteDefinitionWithUploads[] = [
  // Stock Reports and Analytics
  {
    method: "get",
    path: "/report",
    roles: adminOnly,
    handler: getStockReport as unknown as RequestHandler,
  },
  {
    method: "get",
    path: "/status/:status",
    roles: adminOnly,
    handler: getProductsByStatus as unknown as RequestHandler,
  },
  {
    method: "get",
    path: "/low-stock",
    roles: adminOnly,
    handler: getLowStockProducts as unknown as RequestHandler,
  },
  {
    method: "get",
    path: "/out-of-stock",
    roles: adminOnly,
    handler: getOutOfStockProducts as unknown as RequestHandler,
  },
  // Stock Management
  {
    method: "put",
    path: "/:productId",
    roles: adminOnly,
    validator: updateStockSchema,
    handler: updateProductStock as unknown as RequestHandler,
  },
  {
    method: "patch",
    path: "/:productId/threshold",
    roles: adminOnly,
    validator: setThresholdSchema,
    handler: setStockThreshold as unknown as RequestHandler,
  },
  {
    method: "post",
    path: "/bulk-update",
    roles: adminOnly,
    validator: bulkUpdateStockSchema,
    handler: bulkUpdateStock as unknown as RequestHandler,
  },
  // Stock History and Monitoring
  {
    method: "get",
    path: "/:productId/history",
    roles: adminOnly,
    handler: getStockHistory as unknown as RequestHandler,
  },
  {
    method: "post",
    path: "/monitor",
    roles: adminOnly,
    handler: triggerStockMonitoring as unknown as RequestHandler,
  },
];

//🎯
mapRoutesToRouterWithUploads(router, routes, validateAndHandle);

export const Stock_Router = router;
export default Stock_Router;
