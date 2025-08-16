import express, { RequestHandler } from "express";
import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import { productSchema, productUpdateSchema } from "./product.validator";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "./service/product.controller";
import { authorize } from "../../utils/middleware/jwt";
import {
  mapRoutesToRouterWithUploads,
  RouteDefinitionWithUploads,
} from "../../utils/helper/mapRoutesToRouter";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Role specific middlewares
const adminOnly = authorize(["admin"]);
const adminAndUser = authorize(["admin", "user"]);

// Custom middleware to handle file uploads
const uploadMiddleware = upload.array("images", 5);

// Route definitions
const routes: RouteDefinitionWithUploads[] = [
  {
    method: "post",
    path: "/",
    roles: adminOnly,
    validator: productSchema,
    handler: createProduct as unknown as RequestHandler,
    uploadMiddleware: uploadMiddleware as RequestHandler,
  },
  {
    method: "get",
    path: "/",
    roles: adminAndUser,
    handler: getProducts as unknown as RequestHandler,
  },
  {
    method: "get",
    path: "/:productId",
    roles: adminAndUser,
    handler: getProduct as unknown as RequestHandler,
  },
  {
    method: "put",
    path: "/:productId",
    roles: adminOnly,
    validator: productUpdateSchema,
    handler: updateProduct as unknown as RequestHandler,
    uploadMiddleware: uploadMiddleware as RequestHandler,
  },
  {
    method: "patch",
    path: "/:productId/restore",
    roles: adminOnly,
    handler: restoreProduct as unknown as RequestHandler,
  },
  
  {
    method: "patch",
    path: "/:productId",
    roles: adminOnly,
    handler: deleteProduct as unknown as RequestHandler,
  },
];

//🎯
mapRoutesToRouterWithUploads(router, routes, validateAndHandle);

export const Product_Router = router;
export default Product_Router;
