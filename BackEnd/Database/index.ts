import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../Entities/User"
import { Technology } from "../Entities/Technology"
import { Email } from "../Entities/Email"
import Project from "../Entities/Project"


export const AppDataSource = new DataSource({
    type :"postgres",
    host : process.env.DATABASE_HOST,
    port : parseInt(process.env.DATABASE_PORT as string),
    username :process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME,
    synchronize : true, 
    logging : false, 
    entities :[User , Technology, Email , Project],
    migrations :[],
    subscribers :[]
}) 