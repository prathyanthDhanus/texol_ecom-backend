import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";

const url = process.env.MONGODB_URL as string;
const PORT = process.env.PORT || 3000;

// MongoDB connection setup
mongoose.connect(url)
  .then(() => console.log("Mongodb atlas connected"))
  .catch((error:string) => console.log("Error:", error));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
