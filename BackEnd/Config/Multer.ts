import multer from "multer";
export const multerStorage :multer.StorageEngine = multer.memoryStorage()