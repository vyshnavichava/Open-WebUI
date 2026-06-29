import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder || process.env.CLOUDINARY_UPLOAD_FOLDER || "uploads",
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      resource_type: "auto",
    });

    return result;
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err.message);
    throw new Error("Cloudinary upload failed");
  }
}

export default cloudinary;
