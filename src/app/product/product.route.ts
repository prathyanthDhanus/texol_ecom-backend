import express from "express";
import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import { productSchema, productUpdateSchema } from "./product.validator";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  restoreProduct
} from "./service/product.controller";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  upload.array("images", 5), // Allow up to 5 images
  validateAndHandle(productSchema, createProduct)
);

router.get("/", getProducts);

router.put(
  "/:productId",
  upload.array("images", 5),
  validateAndHandle(productUpdateSchema, updateProduct)
);


router.patch("/:productId", deleteProduct);
router.patch("/:productId/restore", restoreProduct);

export const Product_Router = router;
export default Product_Router;