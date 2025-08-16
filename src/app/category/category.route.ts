import express, { RequestHandler } from "express";
import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import {
  categorySchema,
  categoryUpdateSchema,
  categoryRestoreSchema,
} from "./category.validator";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from "./service/category.controller";
import { authorize } from "../../utils/middleware/jwt";
import {
  mapRoutesToRouterWithUploads,
  RouteDefinitionWithUploads,
} from "../../utils/helper/mapRoutesToRouter";

const router = express.Router();

// Role specific middlewares
const adminOnly = authorize(["admin"]);
const adminAndUser = authorize(["admin", "user"]);

// Route definitions
const routes: RouteDefinitionWithUploads[] = [
  {
    method: "post",
    path: "/",
    roles: adminOnly,
    validator: categorySchema,
    handler: createCategory as unknown as RequestHandler,
  },
  {
    method: "get",
    path: "/",
    roles: adminAndUser,
    handler: getCategories as unknown as RequestHandler,
  },
  {
    method: "put",
    path: "/:categoryId",
    roles: adminOnly,
    validator: categoryUpdateSchema,
    handler: updateCategory as unknown as RequestHandler,
  },
  {
    method: "patch",
    path: "/:categoryId/restore",
    roles: adminOnly,
    validator: categoryRestoreSchema,
    handler: restoreCategory as unknown as RequestHandler,
  },
  {
    method: "patch",
    path: "/:categoryId",
    roles: adminOnly,
    handler: deleteCategory as unknown as RequestHandler,
  },
];

//🎯
mapRoutesToRouterWithUploads(router, routes, validateAndHandle);

export const Category_Router = router;
export default Category_Router;
