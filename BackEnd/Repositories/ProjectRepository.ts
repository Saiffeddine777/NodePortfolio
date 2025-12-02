import Project  from "../Entities/Project";
import { DataSource } from "../EnvDataSource";

export const ProjectRepository = DataSource.getRepository(Project)
