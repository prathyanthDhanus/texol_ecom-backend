import { Request, Response } from "express";
import {
  createProductDb,
  getProductsDb,
  getProductDb,
  updateProductDb,
  deleteProductDb,
  restoreProductDb
} from "./product.db";
import { uploadToCloudinary } from "../../../utils/cloudinary/cloudinary";
import { SocketEvents } from "../../../utils/soket";

interface ProductRequestBody {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  lowStockThreshold?: number;
  images?: Express.Multer.File[];
  existingImages?: string | string[];
}

interface ProductDbBody {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  lowStockThreshold: number;
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

  const { name, description, price, category, stock, lowStockThreshold } = req.body;

  const product = await createProductDb({
    name,
    description,
    price: parseFloat(parseFloat(price.toString()).toFixed(2)),
    category,
    stock: Number(stock),
    lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : 10,
    images: imageUrls,
  });

  // Emit new product notification to all users
  const io = req.app.get("io");
  SocketEvents.emitInventoryUpdate(io, product);

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

// ・・・・・・・・・・・・・・・  Get Single Product ・・・・・・・・・・・・・・・

// 📌
export const getProduct = async (
  req: Request<{ productId: string }>,
  res: Response
) => {
  const { productId } = req.params;

  const product = await getProductDb(productId);

  return res.status(200).json({
    status: "success",
    message: "Product fetched successfully",
    data: product,
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
  const { images: _, existingImages: __, ...bodyWithoutImages } = req.body;
  const updateData: Partial<ProductDbBody> = { ...bodyWithoutImages };

  // Convert numeric fields to proper numbers
  if (updateData.price !== undefined) {
    // Handle price precision by treating it as a string and converting carefully
    const priceStr = updateData.price.toString();
    // Remove any scientific notation and ensure proper decimal handling
    const cleanPrice = parseFloat(priceStr).toFixed(2);
    updateData.price = parseFloat(cleanPrice);
  }
  if (updateData.stock !== undefined) {
    updateData.stock = Number(updateData.stock);
  }
  if (updateData.lowStockThreshold !== undefined) {
    updateData.lowStockThreshold = Number(updateData.lowStockThreshold);
  }

  // Handle image updates
  let finalImages: string[] = [];

  // Add existing images that weren't removed
  if (req.body.existingImages) {
    const existingImages = Array.isArray(req.body.existingImages) 
      ? req.body.existingImages 
      : [req.body.existingImages];
    finalImages.push(...existingImages);
  }

  // Add new uploaded images
  if (req.files && Array.isArray(req.files)) {
    const files = req.files as Express.Multer.File[];
    const newImageUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.path))
    );
    finalImages.push(...newImageUrls);
  }

  // Set the final images array
  if (finalImages.length > 0) {
    updateData.images = finalImages;
  }

  const updatedProduct = await updateProductDb({
    productId,
    ...updateData,
  });

  // Emit inventory update notification if stock changed
  if (req.body.stock !== undefined) {
    const io = req.app.get("io");
    SocketEvents.emitInventoryUpdate(io, updatedProduct);
  }

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

  // Emit product deletion notification
  const io = req.app.get("io");
  SocketEvents.emitProductDeleted(io, deletedProduct);

  return res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: deletedProduct,
  });
};
