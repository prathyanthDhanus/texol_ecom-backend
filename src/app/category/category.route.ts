import express from "express";
import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import { categorySchema, categoryUpdateSchema } from "./category.validator";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "./service/category.controller";

const router = express.Router();

router.post("/", validateAndHandle(categorySchema, createCategory));

router.get("/", getCategories);

router.put(
  "/:categoryId",
  validateAndHandle(categoryUpdateSchema, updateCategory)
);
router.patch("/:categoryId", deleteCategory);

export const Category_Router = router;
export default Category_Router;
