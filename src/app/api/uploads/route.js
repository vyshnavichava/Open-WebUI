import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import { getAuthUser } from "@/utils/auth";
import { uploadToCloudinary } from "@/utils/cloudinary";
// import { uploadToUploadcare } from "@/utils/uploadcare";
import { UPLOADS } from "@/helpers/constants";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const user = getAuthUser();

    const form = formidable({ multiples: true, maxFileSize: UPLOADS.MAX_FILE_SIZE_MB * 1024 * 1024 });

    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const files = Array.isArray(data.files.file) ? data.files.file : [data.files.file];
    const uploadedFiles = [];

    for (const file of files) {
      if (!UPLOADS.SUPPORTED_IMAGE_TYPES.includes(file.mimetype)) {
        return NextResponse.json({ error: `Unsupported file type: ${file.mimetype}` }, { status: 400 });
      }

      const cloudinaryResult = await uploadToCloudinary(file.filepath, `${UPLOADS.CLOUDINARY_FOLDER}/${user.userId}`);
      // const uploadcareResult = await uploadToUploadcare(cloudinaryResult.secure_url);

      uploadedFiles.push({
        name: file.originalFilename,
        url: cloudinaryResult.secure_url,
        size: file.size,
      });

      fs.unlinkSync(file.filepath);
    }

    return NextResponse.json({ uploaded: uploadedFiles });
  } catch (err) {
    console.error("Uploads POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
