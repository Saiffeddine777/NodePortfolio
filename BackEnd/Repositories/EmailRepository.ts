import { Email } from "../Entities/Email";
import { DataSource } from "../EnvDataSource";

export const EmailRepository = DataSource.getRepository(Email)