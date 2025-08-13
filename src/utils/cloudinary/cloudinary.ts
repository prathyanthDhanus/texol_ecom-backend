import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  filePath: string
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "products",
    });
    // Delete file from server after upload
    fs.unlinkSync(filePath);
    return result.secure_url;
  } catch (error) {
    // Delete file from server if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error("Failed to upload image to Cloudinary");
  }
};