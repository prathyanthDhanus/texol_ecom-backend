import express from "express";
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

const router = express.Router();

router.post(
  "/",
  authorize(["admin"]),
  validateAndHandle(categorySchema, createCategory)
);

router.get("/", authorize(["admin", "user"]), getCategories);

router.put(
  "/:categoryId",
  authorize(["admin"]),
  validateAndHandle(categoryUpdateSchema, updateCategory)
);

router.patch(
  "/:categoryId/restore",
  authorize(["admin"]),
  validateAndHandle(categoryRestoreSchema, restoreCategory)
);
router.patch("/:categoryId", authorize(["admin"]), deleteCategory);

export const Category_Router = router;
export default Category_Router;
