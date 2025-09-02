import { AppDataSource } from "../Database";
import { Technology } from "../Entities/Technology";

export const TechnologyRepository = AppDataSource.getRepository(Technology);