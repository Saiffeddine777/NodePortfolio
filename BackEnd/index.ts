import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import UserRouter from "./Routers/UserRouter";
import { AppDataSource } from "./Database";


const port :number = 4000;
const app :express.Express = express()
app.use(cors())
app.use(express.json())




AppDataSource.initialize().then(
    ()=>{
       console.log("Data source has been initialised")
       app.use("/api/users" , UserRouter)
       app.listen(port , ()=>console.log(`App running on ${port}`)) 
    }
)
.catch(err=>console.error(err))


  