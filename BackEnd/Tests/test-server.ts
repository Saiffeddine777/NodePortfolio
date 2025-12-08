import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import {UserRouter} from "../Routers/UserRouter";
import {TechnologyRouter} from "../Routers/TechnologyRouter";
import {EmailRouter} from "../Routers/EmailRouter";
import {ProjectRouter} from "../Routers/ProjectRouter";
import { refreshTokenController } from "../RefreshToken";


export const testApp = express();

testApp.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  exposedHeaders: ["Authorization"]
}));

testApp.use(express.json());
testApp.use(cookieParser());

testApp.post("/refresh", refreshTokenController);
testApp.use("/api/users", UserRouter);
testApp.use("/api/technologies", TechnologyRouter);
testApp.use("/api/emails", EmailRouter);
testApp.use("/api/projects", ProjectRouter);
