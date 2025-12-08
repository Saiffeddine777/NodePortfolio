import { Router } from "express";
import {
  postATechnology,
  getAllTechnologies,
  getOneTechnology,
  deleteOneTechnology,
  updateOneTechnology,
  getTechnolgiesByTechType
} from "../Controllers/TechnologyController";
import uploadImage from "../Handlers/UploadImageHandler";
import { isAdmin } from "../Middlewares/VerifyAdmin";

export const TechnologyRouter = Router();

TechnologyRouter.post("/" , isAdmin,uploadImage, postATechnology);
TechnologyRouter.get("/", getAllTechnologies);
TechnologyRouter.get("/:id", getOneTechnology);
TechnologyRouter.delete("/:id" , isAdmin, deleteOneTechnology);
TechnologyRouter.put("/:id" ,isAdmin,uploadImage, updateOneTechnology);
TechnologyRouter.get("/type/:type", getTechnolgiesByTechType);

