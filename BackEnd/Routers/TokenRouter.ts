import { Router } from "express";
import * as TokenController from "../Controllers/TokenController";

const TokenRouter = Router ();

TokenRouter.post("/verify" , TokenController.verifyToken);

export default TokenRouter