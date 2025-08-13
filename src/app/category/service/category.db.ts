import Category, { ICategory } from "../model/category.model";
import AppError from "../../../utils/customError/AppError";

// ・・・・・・・・・・・・・・・   Create category  ・・・・・・・・・・・・・・・
interface CategoryDbParams {
  name: string;
  description: string;
}
// 📌
export const createCategoryDb = async ({
  name,
  description,
}: CategoryDbParams): Promise<ICategory> => {
  const findCategory = await Category.findOne({ name });
  if (findCategory) {
    throw new AppError(
      "Category already exists",
      "Field validation error: Category already exists",
      409
    );
  }

  const newCategory = new Category({
    name,
    description,
  });

  await newCategory.save();
  return newCategory;
};

// ・・・・・・・・・・・・・・・   Get all categories  ・・・・・・・・・・・・・・・

// 📌
export const getCategoriesDb = async (
  page: number,
  limit: number
): Promise<{ categories: ICategory[]; total: number; totalPages: number }> => {
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find({ isDeleted: false }).skip(skip).limit(limit),
    Category.countDocuments({ isDeleted: false }),
  ]);

  return {
    categories,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

// ・・・・・・・・・・・・・・・  Update a category ・・・・・・・・・・・・・・・
interface UpdateCategoryParams {
  categoryId: string;
  name: string;
  description?: string;
}
// 📌
export const updateCategoryDb = async ({
  categoryId,
  name,
  description,
}: UpdateCategoryParams): Promise<ICategory> => {
  const updatedCategory = await Category.findByIdAndUpdate(
    { _id: categoryId, isDeleted: false },
    { name, description },
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    throw new AppError(
      "Category not found",
      "Resource not found: Category does not exist",
      404
    );
  }

  return updatedCategory;
};

// ・・・・・・・・・・・・・・・  Delete a category ・・・・・・・・・・・・・・・
interface DeleteCategoryParams {
  categoryId: string;
}
// 📌
export const deleteCategoryDb = async ({
  categoryId,
}: DeleteCategoryParams): Promise<ICategory> => {
  const deletedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedCategory) {
    throw new AppError(
      "Category not found",
      "Resource not found: Category does not exist",
      404
    );
  }

  return deletedCategory;
};
