import express from "express";

import Auth_Router from "./app/auth/auth.route";

const router = express.Router();

router.use("/auth", Auth_Router);

const Main_Router = router;
export default Main_Router;
