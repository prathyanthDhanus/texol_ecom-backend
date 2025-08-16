import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Cloudinary configuration is incomplete");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
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