import { Request, Response } from "express";
import {
  createProductDb,
  getProductsDb,
  updateProductDb,
  deleteProductDb,
  restoreProductDb
} from "./product.db";
import { uploadToCloudinary } from "../../../utils/cloudinary/cloudinary";

interface ProductRequestBody {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: Express.Multer.File[];
}

interface ProductDbBody {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

// ・・・・・・・・・・・・・・・  Create Product ・・・・・・・・・・・・・・・

// 📌
export const createProduct = async (
  req: Request<{}, {}, ProductRequestBody>,
  res: Response
) => {
  let imageUrls: string[] = [];

  // Upload images to Cloudinary if they exist
  if (req.files && Array.isArray(req.files)) {
    const files = req.files as Express.Multer.File[];
    imageUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.path))
    );
  }

  const { name, description, price, category, stock } = req.body;

  const product = await createProductDb({
    name,
    description,
    price: Number(price),
    category,
    stock: Number(stock),
    images: imageUrls,
  });

  return res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
};

// ・・・・・・・・・・・・・・・  Get All Products ・・・・・・・・・・・・・・・

// 📌
export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const { products, total, totalPages } = await getProductsDb(page, limit);
  return res.status(200).json({
    status: "success",
    message: "Products fetched successfully",
    data: products,
    pagination: {
      total,
      page,
      totalPages,
    },
  });
};

// ・・・・・・・・・・・・・・・  Update Product ・・・・・・・・・・・・・・・

// 📌
export const updateProduct = async (
  req: Request<{ productId: string }, {}, Partial<ProductRequestBody>>,
  res: Response
) => {
  const { productId } = req.params;

  // Create update data excluding images from req.body
  const { images: _, ...bodyWithoutImages } = req.body;
  const updateData: Partial<ProductDbBody> = { ...bodyWithoutImages };

  // Handle image updates separately
  if (req.files && Array.isArray(req.files)) {
    const files = req.files as Express.Multer.File[];
    updateData.images = await Promise.all(
      files.map((file) => uploadToCloudinary(file.path))
    );
  }

  const updatedProduct = await updateProductDb({
    productId,
    ...updateData,
  });

  return res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: updatedProduct,
  });
};

// ・・・・・・・・・・・・・・・  Restore Product ・・・・・・・・・・・・・・・

// 📌
export const restoreProduct = async (
  req: Request<{ productId: string }>,
  res: Response
) => {
  const { productId } = req.params;
  const deletedProduct = await restoreProductDb(productId);

  return res.status(200).json({
    status: "success",
    message: "Product restored successfully",
    data: deletedProduct,
  });
};
// ・・・・・・・・・・・・・・・  Delete Product ・・・・・・・・・・・・・・・

// 📌
export const deleteProduct = async (
  req: Request<{ productId: string }>,
  res: Response
) => {
  const { productId } = req.params;
  const deletedProduct = await deleteProductDb(productId);

  return res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: deletedProduct,
  });
};
