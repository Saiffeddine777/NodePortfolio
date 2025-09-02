import multer from "multer"
import { multerStorage } from "../Config/Multer"


const uploadImageFileFilter :multer.Options["fileFilter"] = (req,file , cb:any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error ("Invalid file type. Only JPEG and PNG are allowed!"), false);
  }
};

const uploadImageHandler = multer({
    storage : multerStorage,
    fileFilter :uploadImageFileFilter
})

const uploadImage = uploadImageHandler.single("file")  

export default uploadImage