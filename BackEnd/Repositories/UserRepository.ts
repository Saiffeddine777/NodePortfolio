import { User } from "../Entities/User";
import { DataSource } from "../EnvDataSource";


export const UserRepository = DataSource.getRepository(User)

