import { Router } from "express";
import * as PortfolioFileController from "../Controllers/PortfolioFileController"
import uploadImage from "../Handlers/UploadImageHandler";
import { isAdmin } from "../Middlewares/VerifyAdmin";

const PortfolioFileRouter: Router = Router();

PortfolioFileRouter.post("/" , isAdmin ,uploadImage,PortfolioFileController.postAPortfolioFile);
PortfolioFileRouter.get("/" , PortfolioFileController.getAllPortfolioFile);
PortfolioFileRouter.get("/:id" , PortfolioFileController.getOnePortfolioFile);
PortfolioFileRouter.delete("/:id",isAdmin , PortfolioFileController.deleteOnePorfolioFile);
PortfolioFileRouter.delete("/delete/:fileName" , isAdmin , PortfolioFileController.deleteOnePorfolioFileWithName);
PortfolioFileRouter.get("/cvs/:fullCv/:itcv" , PortfolioFileController.getCVPortfolioFile);
PortfolioFileRouter.get("/getpaginatedfiles/:limit/:page" , PortfolioFileController.getPaginatedFiles);

export default PortfolioFileRouter;