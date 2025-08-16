import express from "express";

import { authorize } from "./utils/middleware/jwt";

import Auth_Router from "./app/auth/auth.route";
import Category_Router from "./app/category/category.route";
import Product_Router from "./app/product/product.route";
import Order_Router from "./app/order/order.route";
import Cart_Router from "./app/cart/cart.route";
import Stock_Router from "./app/stock/stock.route";

const router = express.Router();

router.use("/auth", Auth_Router);
router.use("/categories", Category_Router);
router.use("/products", Product_Router);
router.use("/orders", Order_Router);
router.use("/cart", Cart_Router);
router.use("/stock", Stock_Router);

const Main_Router = router;
export default Main_Router;
