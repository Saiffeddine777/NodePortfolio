import { AppDataSource, DevDataSource } from "./Database";

export const DataSource = process.env.NODE_ENV === "production" ? AppDataSource :DevDataSource