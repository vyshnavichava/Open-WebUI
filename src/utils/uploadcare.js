import uploadcare from "@uploadcare/rest-client";

export const uploadcareClient = uploadcare({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  secretKey: process.env.UPLOADCARE_SECRET_KEY,
});

export async function uploadToUploadcare(fileUrl) {
  try {
    const result = await uploadcareClient.uploadFile(fileUrl);
    return result;
  } catch (err) {
    console.error("❌ Uploadcare upload error:", err.message);
    throw new Error("Uploadcare upload failed");
  }
}
