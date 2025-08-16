import Product, { IProduct } from "../model/product.model";
import Category from "../../category/model/category.model";
import AppError from "../../../utils/customError/AppError";

interface ProductDbParams {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  lowStockThreshold?: number;
  images?: string[];
}

interface UpdateProductParams extends Partial<ProductDbParams> {
  productId: string;
}

// ・・・・・・・・・・・・・・・  Create Product ・・・・・・・・・・・・・・・

// 📌
export const createProductDb = async ({
  name,
  description,
  price,
  category,
  stock,
  lowStockThreshold,
  images = [],
}: ProductDbParams): Promise<IProduct> => {
  const categoryExists = await Category.findById(category);
  if (!categoryExists || categoryExists.isDeleted) {
    throw new AppError(
      "Category not found",
      "Resource not found: Category does not exist",
      404
    );
  }

  const newProduct = new Product({
    name,
    description,
    price,
    category,
    stock,
    lowStockThreshold,
    images,
  });

  await newProduct.save();
  return newProduct;
};

// ・・・・・・・・・・・・・・・  Get All Products ・・・・・・・・・・・・・・・

// 📌
export const getProductsDb = async (
  page: number,
  limit: number
): Promise<{ products: IProduct[]; total: number; totalPages: number }> => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find()
      .populate("category", "name")
      .skip(skip)
      .limit(limit),
    Product.countDocuments(),
  ]);

  return {
    products,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

// ・・・・・・・・・・・・・・・  Update Product ・・・・・・・・・・・・・・・

// 📌
export const updateProductDb = async ({
  productId,
  ...updateData
}: UpdateProductParams): Promise<IProduct> => {
  if (updateData.category) {
    const categoryExists = await Category.findById(updateData.category);
    if (!categoryExists || categoryExists.isDeleted) {
      throw new AppError(
        "Category not found",
        "Resource not found: Category does not exist",
        404
      );
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: productId, isDeleted: false },
    updateData,
    { new: true, runValidators: true }
  ).populate("category", "name");

  if (!updatedProduct) {
    throw new AppError(
      "Product not found",
      "Resource not found: Product does not exist",
      404
    );
  }

  return updatedProduct;
};

// ・・・・・・・・・・・・・・・  Restore Product ・・・・・・・・・・・・・・・

// 📌
export const restoreProductDb = async (productId: string): Promise<IProduct> => {
  const deletedProduct = await Product.findByIdAndUpdate(
    productId,
    { isDeleted: false },
    { new: true }
  );

  if (!deletedProduct) {
    throw new AppError(
      "Product not found",
      "Resource not found: Product does not exist",
      404
    );
  }

  return deletedProduct;
};
// ・・・・・・・・・・・・・・・  Delete Product ・・・・・・・・・・・・・・・

// 📌
export const deleteProductDb = async (productId: string): Promise<IProduct> => {
  const deletedProduct = await Product.findByIdAndUpdate(
    productId,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedProduct) {
    throw new AppError(
      "Product not found",
      "Resource not found: Product does not exist",
      404
    );
  }

  return deletedProduct;
};
