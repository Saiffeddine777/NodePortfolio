import { Router } from "express";
import * as ProjectController from "../Controllers/ProjectController";
import uploadImage from "../Handlers/UploadImageHandler";
import { isAdmin } from "../Middlewares/VerifyAdmin";

const ProjectRouter :Router = Router()

ProjectRouter.post("/",isAdmin ,uploadImage,ProjectController.postOneProject);
ProjectRouter.get("/:id" , ProjectController.getOneProject)
ProjectRouter.get("/" , ProjectController.getAllProjects)
ProjectRouter.delete("/:id",isAdmin , ProjectController.deleteOneProject)
ProjectRouter.put("/:id",isAdmin , uploadImage, ProjectController.putOneProject)
ProjectRouter.get("/getpaginatedprojects/:limit/:page", ProjectController.getPaginatedProjects)

export default  ProjectRouter;