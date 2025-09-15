import { DeleteResult, UpdateResult } from "typeorm";
import Project from "../Entities/Project";
import { ProjectRepository } from "../Repositories/ProjectRepository";

export const createOneProject: (
  poject: Partial<Project>
) => Promise<Project> = async (project) => {
  try {
    const createdProeject: Project = ProjectRepository.create(project);
    return await ProjectRepository.save(createdProeject);
  } catch (error) {
    throw error;
  }
};

export const findAllProjects: () => Promise<Project[]> = async () => {
  try {
    return await ProjectRepository.find();
  } catch (error) {
    throw error;
  }
};

export const findOneProject: (
  id: number
) => Promise<Project | undefined | null> = async (id) => {
  try {
    return await ProjectRepository.findOneBy({ id });
  } catch (error) {
    throw error;
  }
};

export const removeOneProject: (id: number) => Promise<DeleteResult> = async (
  id
) => {
  try {
    return await ProjectRepository.delete(id);
  } catch (error) {
    throw error;
  }
};

export const modifyOneProject: (
  id: number,
  data: Partial<Project>
) => Promise<UpdateResult> = async (id, data) => {
  try {
    return await ProjectRepository.update(id, data);
  } catch (error) {
    throw error;
  }
};
