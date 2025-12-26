import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import {cloudinary} from "../cloudinaryConfig.js";

export const uploadMiddleware=(folderName)=>{
    const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folderPath = `${folderName.trim()}`; // Update the folder path here
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;
      
      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
      };
    },
  });

  return multer({
    storage: storage,
    fileFilter: 
   (req, file, cb) => {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only PDF files are allowed"), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
  });

}