import { DeleteResult, In } from "typeorm";
import { PortfolioFile } from "../Entities/PortfolioFile";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { PortfolioFileRepository } from "../Repositories/PortfolioFileRepository";
import {
  deleteFromCloudinary,
  uploadToCLoudinary,
} from "../Adapters/CloudinaryAdapter";
import { AppRepository, NullableOrUndefined } from "../Types/UtilityTypes";
import { handlePagination } from "../Handlers/PaginationHandler";

export const createAPortfolioFile: (
  portfolioFile: Partial<PortfolioFile>,
  blob?: Express.Multer.File,
) => Promise<PortfolioFile> = async (portfolioFile, blob) => {
  try {
    const result = await uploadToCLoudinary(blob);
    const file: PortfolioFile = PortfolioFileRepository.create({
      publicId: result?.public_id,
      publicUrl: result?.url,
      ...portfolioFile,
    });
    return await PortfolioFileRepository.save(file);
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findAllPortfolioFiles: () => Promise<
  PortfolioFile[]
> = async () => {
  try {
    return await PortfolioFileRepository.find();
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findOnePortfolioFile: (
  id: number,
) => Promise<PortfolioFile | undefined | null> = async (id) => {
  try {
    return await PortfolioFileRepository.findOneBy({ id: id });
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const removeOnePortfolioFile: (
  id: number,
) => Promise<DeleteResult> = async (id) => {
  try {
    const portfolioFile: NullableOrUndefined<PortfolioFile> =
      await PortfolioFileRepository.findOneBy({ id: id });
    await deleteFromCloudinary(portfolioFile?.publicId);
    return await PortfolioFileRepository.delete(id);
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const removeAPortfolioFileWithName: (
  fileName: string,
) => Promise<DeleteResult | null> = async (fileName) => {
  try {
    const portfolioFile: NullableOrUndefined<PortfolioFile> =
      await PortfolioFileRepository.findOneBy({ fileName: fileName });
    if (!portfolioFile) {
      return null;
    }
    await deleteFromCloudinary(portfolioFile?.publicId);
    return await PortfolioFileRepository.delete({ fileName: fileName });
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findCVportfolioFiles: (
  fileNames: string[],
) => Promise<PortfolioFile[]> = async (fileNames) => {
  try {
    return await PortfolioFileRepository.find({
      where: {
        fileName: In(fileNames),
      },
    });
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findWithFilesPagination: (
  limit: number,
  page: number,
) => Promise<any> = async (limit, page) => {
  try {
    return await handlePagination(
      limit,
      page,
      PortfolioFileRepository as AppRepository,
    );
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};
