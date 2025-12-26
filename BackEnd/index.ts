import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./Routers/UserRouter";
import TechnologyRouter from "./Routers/TechnologyRouter";
import EmailRouter from "./Routers/EmailRouter";
import ProjectRouter from "./Routers/ProjectRouter";
import { DataSource } from "./EnvDataSource";
import createAnAdminifNotExist from "./SpecialServices/CreateAnAdminIfNotExist";
import { refreshTokenController } from "./RefreshToken";
import { healthCheck } from "./Helpers/ExpressHealthCheck";

const port: number = parseInt(process.env.SERVER_PORT as string);
const origin : string[] =[ 
   process.env.FRONT_URL as string,
   process.env.FRONT_URL_NO_WWW as string
  ,"http://localhost:5173"].filter(Boolean);

const app: express.Express = express();
app.use(cors({
  origin,
  credentials : true, 
  exposedHeaders :["Authorization"]
}));
app.use(express.json());
app.use(cookieParser());
app.get("/health" , healthCheck);
app.post("/refresh" , refreshTokenController);
app.use("/api/users", UserRouter);
app.use("/api/technologies", TechnologyRouter);
app.use("/api/emails", EmailRouter);
app.use("/api/projects", ProjectRouter);

DataSource.initialize()
  .then(() => {
    console.log("Data source has been initialised");

    app.listen(port , () => console.log(`App running on ${port}`));
    createAnAdminifNotExist()
      .then(() => {})
      .catch((error) => console.log(error));
  })
  .catch((err) => console.error(err));


