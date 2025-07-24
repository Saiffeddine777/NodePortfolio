import { AppDataSource } from "../Database";
import { User } from "../Entities/User";


export const UserRepository = AppDataSource.getRepository(User)

