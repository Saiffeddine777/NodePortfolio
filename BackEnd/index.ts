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

const port: number = parseInt(process.env.SERVER_PORT as string);
const app: express.Express = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

DataSource.initialize()
  .then(() => {
    console.log("Data source has been initialised");
    app.use("/api/users", UserRouter);
    app.use("/api/technologies", TechnologyRouter);
    app.use("/api/emails", EmailRouter);
    app.use("/api/projects", ProjectRouter);
    app.listen(port, () => console.log(`App running on ${port}`));
  })
  .catch((err) => console.error(err));
