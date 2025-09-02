import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import UserRouter from "./Routers/UserRouter";
import { AppDataSource } from "./Database";
import TechnologyRouter from "./Routers/TechnologyRouter"

const port :number = parseInt(process.env.SERVER_PORT as string);
const app :express.Express = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

AppDataSource.initialize().then(
    ()=>{
       console.log("Data source has been initialised")
       app.use("/api/users" , UserRouter)
       app.use("/api/technologies" , TechnologyRouter)
       app.listen(port , ()=>console.log(`App running on ${port}`)) 
    }
)
.catch(err=>console.error(err))