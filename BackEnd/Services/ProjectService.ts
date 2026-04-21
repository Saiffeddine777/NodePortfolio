import { DeleteResult, UpdateResult } from "typeorm";
import Project from "../Entities/Project";
import { ProjectRepository } from "../Repositories/ProjectRepository";
import {
  deleteFromCloudinary,
  uploadToCLoudinary,
} from "../Adapters/CloudinaryAdapter";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { AppRepository, NullableOrUndefined } from "../Types/UtilityTypes";
import { handlePagination } from "../Handlers/PaginationHandler";

export const createOneProject: (
  poject: Partial<Project>,
  file?: Express.Multer.File,
) => Promise<Project> = async (project, file) => {
  try {
    const createdProject: Project = ProjectRepository.create(project);
    const result = await uploadToCLoudinary(file);
    return await ProjectRepository.save({
      ...createdProject,
      publicId: result?.public_id,
      imageUrl: result?.url,
    });
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findAllProjects: () => Promise<Project[]> = async () => {
  try {
    return await ProjectRepository.find();
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findOneProject: (
  id: number,
) => Promise<Project | undefined | null> = async (id) => {
  try {
    return await ProjectRepository.findOneBy({ id });
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const removeOneProject: (id: number) => Promise<DeleteResult> = async (
  id,
) => {
  try {
    const projectToDelete: NullableOrUndefined<Project> =
      await ProjectRepository.findOneBy({ id });
    await deleteFromCloudinary(projectToDelete?.publicId);
    return await ProjectRepository.delete(id);
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const modifyOneProject: (
  id: number,
  data: Partial<Project>,
  file?: Express.Multer.File,
) => Promise<UpdateResult> = async (id, data, file) => {
  try {
    if (file) {
      const projectToModify: Project | null = await ProjectRepository.findOneBy(
        { id },
      );
      await deleteFromCloudinary(projectToModify?.publicId);
      const result = await uploadToCLoudinary(file);
      data.publicId = result?.public_id;
      data.imageUrl = result?.url;
      return await ProjectRepository.update(id, data);
    }
    return await ProjectRepository.update(id, data);
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findProjectsWithPagination: (
  limit: number,
  page: number,
) => Promise<any> = async (limit, page) => {
  try {
    return await handlePagination(
      limit,
      page,
      ProjectRepository as AppRepository,
    );
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};
