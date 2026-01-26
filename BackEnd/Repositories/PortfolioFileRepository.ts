import { PortfolioFile } from "../Entities/PortfolioFile";
import { DataSource } from "../EnvDataSource";

export const PortfolioFileRepository = DataSource.getRepository(PortfolioFile)

