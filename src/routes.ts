import express from "express";

import { tokenVerifyUser } from "./utils/middleware/jwt";

import Auth_Router from "./app/auth/auth.route";
import Category_Router from "./app/category/category.route";
import Product_Router from "./app/product/product.route";

const router = express.Router();

router.use("/auth", Auth_Router);

// Auth middleware
router.use(tokenVerifyUser);

router.use("/category", Category_Router);
router.use("/product", Product_Router);

const Main_Router = router;
export default Main_Router;
