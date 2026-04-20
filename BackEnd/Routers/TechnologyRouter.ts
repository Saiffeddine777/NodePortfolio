import { Router } from "express";
import * as TechnologyController from "../Controllers/TechnologyController";
import uploadImage from "../Handlers/UploadImageHandler";
import { isAdmin } from "../Middlewares/VerifyAdmin";

const TechnologyRouter = Router();

TechnologyRouter.post("/" , isAdmin,uploadImage, TechnologyController.postATechnology);
TechnologyRouter.get("/", TechnologyController.getAllTechnologies);
TechnologyRouter.get("/:id", TechnologyController.getOneTechnology);
TechnologyRouter.delete("/:id" , isAdmin, TechnologyController.deleteOneTechnology);
TechnologyRouter.put("/:id" ,isAdmin,uploadImage, TechnologyController.updateOneTechnology);
TechnologyRouter.get("/type/:type", TechnologyController.getTechnolgiesByTechType);
TechnologyRouter.get("/paginate/:limit/:page" , TechnologyController.getTechnologiesWithPagination);

export default  TechnologyRouter;