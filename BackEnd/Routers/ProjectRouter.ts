import { Router } from "express";
import { deleteOneProject, getAllProjects, getOneProject, postOneProject, putOneProject } from "../Controllers/ProjectController";

const ProjectRouter :Router = Router()

ProjectRouter.post("/" ,postOneProject)
ProjectRouter.get("/:id" , getOneProject)
ProjectRouter.get("/" , getAllProjects)
ProjectRouter.delete("/:id" , deleteOneProject)
ProjectRouter.put("/:id" , putOneProject)

export default ProjectRouter  