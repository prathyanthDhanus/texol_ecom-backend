import { Request, Response } from "express";
import {
  createCategoryDb,
  getCategoriesDb,
  updateCategoryDb,
  deleteCategoryDb,
  restoreCategoryDb
} from "./category.db";

// ・・・・・・・・・・・・・・・   Create category  ・・・・・・・・・・・・・・・

interface categoryRequestBody {
  name: string;
  description: string;
  isDeleted?: boolean;
}
// 📌
export const createCategory = async (
  req: Request<{}, {}, categoryRequestBody>,
  res: Response
) => {
  const { name, description } = req.body;
  const addCategory = await createCategoryDb({ name, description });
  return res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: addCategory,
  });
};

// ・・・・・・・・・・・・・・・   Get all categories  ・・・・・・・・・・・・・・・

// 📌
export const getCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const { categories, total, totalPages } = await getCategoriesDb(page, limit);
  return res.status(200).json({
    status: "success",
    message: "Categories fetched successfully",
    data: categories,
    pagination: {
      total,
      page,
      totalPages,
    },
  });
};

// ・・・・・・・・・・・・・・・  Update a category ・・・・・・・・・・・・・・・

// 📌
export const updateCategory = async (
  req: Request<{ categoryId: string }, {}, categoryRequestBody>,
  res: Response
) => {
  const { name, description,isDeleted } = req.body;
  const { categoryId } = req.params;
  
  const updatedCategory = await updateCategoryDb({
    categoryId,
    name,
    description,
    isDeleted
  });

  return res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: updatedCategory,
  });
};
// ・・・・・・・・・・・・・・・  Restore a category ・・・・・・・・・・・・・・・

// 📌
export const restoreCategory = async (
  req: Request<{ categoryId: string }>,
  res: Response
) => {
  const { categoryId } = req.params;
  
  const restoredCategory = await restoreCategoryDb(categoryId);

  return res.status(200).json({
    status: "success",
    message: "Category restored successfully",
    data: restoredCategory,
  });
};

// ・・・・・・・・・・・・・・・  Delete a category ・・・・・・・・・・・・・・・

// 📌
export const deleteCategory = async (
  req: Request<{ categoryId: string }>,
  res: Response
) => {
  const { categoryId } = req.params;
  const deletedCategory = await deleteCategoryDb({ categoryId });

  return res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
    data: deletedCategory,
  });
};
