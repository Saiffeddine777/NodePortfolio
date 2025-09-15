import { Technology } from "../Entities/Technology";
import { DataSource } from "../EnvDataSource";

export const TechnologyRepository = DataSource.getRepository(Technology);