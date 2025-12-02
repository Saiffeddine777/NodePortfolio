import { Router } from "express";
import { deleteOneProject, getAllProjects, getOneProject, postOneProject, putOneProject } from "../Controllers/ProjectController";
import uploadImage from "../Handlers/UploadImageHandler";
import { isAdmin } from "../Middlewares/VerifyAdmin";

const ProjectRouter :Router = Router()

ProjectRouter.post("/",isAdmin ,uploadImage,postOneProject);
ProjectRouter.get("/:id" , getOneProject)
ProjectRouter.get("/" , getAllProjects)
ProjectRouter.delete("/:id",isAdmin , deleteOneProject)
ProjectRouter.put("/:id",isAdmin , uploadImage, putOneProject)

export default ProjectRouter  