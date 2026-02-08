import { Token } from "../Entities/Token";
import { DataSource } from "../EnvDataSource";

export const TokenRepository = DataSource.getRepository(Token);