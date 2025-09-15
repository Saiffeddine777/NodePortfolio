import { AppDataSource } from "../Database";
import Project  from "../Entities/Project";

export const ProjectRepository = AppDataSource.getRepository(Project)