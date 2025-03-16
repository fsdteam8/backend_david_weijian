import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload on Cloudinary method
const uploadOnCloudinary = async (fileBuffer) => {
  try {
    const response = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return null;
        }
        return result;
      }
    ).end(fileBuffer);
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    return null;
  }
};

export { uploadOnCloudinary };