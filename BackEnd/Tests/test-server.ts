import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


import * as UserRouter from "../Routers/UserRouter";
import * as TechnologyRouter from "../Routers/TechnologyRouter";
import * as EmailRouter from "../Routers/EmailRouter";
import * as ProjectRouter from "../Routers/ProjectRouter";
import * as PortfolioFileRouter from "../Routers/PortfolioFileRouter"

import { refreshTokenController } from "../RefreshToken";


const testApp = express();

testApp.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  exposedHeaders: ["Authorization"]
}));

testApp.use(express.json());
testApp.use(cookieParser());


testApp.post("/refresh", refreshTokenController);
testApp.use("/api/users", UserRouter.default);
testApp.use("/api/technologies", TechnologyRouter.default);
testApp.use("/api/emails", EmailRouter.default);
testApp.use("/api/projects", ProjectRouter.default);
testApp.use("/api/files" , PortfolioFileRouter.default);

export default testApp


