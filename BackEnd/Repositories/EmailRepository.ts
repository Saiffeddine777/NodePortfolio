import { AppDataSource } from "../Database";
import { Email } from "../Entities/Email";

export const EmailRepository = AppDataSource.getRepository(Email)