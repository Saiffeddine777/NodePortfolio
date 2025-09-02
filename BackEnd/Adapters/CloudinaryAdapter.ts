import {
  DeleteApiResponse,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import cloudinay from "../Config/Cloudinary";
import { Readable } from "stream";

export const uploadToCLoudinary: (
  file?: Express.Multer.File
) => Promise<UploadApiResponse | undefined> = async (file) => {
  try {
    if (file) {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinay.uploader.upload_stream(
          { folder: "NodePortfolio" },
          (error?: UploadApiErrorResponse, res?: UploadApiResponse) => {
            if (error) reject(error);
            if (!res) reject(new Error("No response From Cloudinary"));
            else resolve(res);
          }
        );
        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(uploadStream);
      });
      return result;
    }
  } catch (error) {
    throw error;
  }
};

export const deleteFromCloudinary: (
  publicId: string
) => Promise<DeleteApiResponse> = async (publicId) => {
  try {
    const result: DeleteApiResponse = await new Promise((resolve, reject) => {
      cloudinay.uploader.destroy(
        publicId,
        (error?: any, res?: DeleteApiResponse) => {
          if (error) reject(error);
          if (!res) reject(new Error("No response From Cloudinary"));
          else resolve(res);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
};
