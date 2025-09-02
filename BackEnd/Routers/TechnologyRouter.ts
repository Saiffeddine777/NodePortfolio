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

const TechnologyRouter = Router();

TechnologyRouter.post("/",uploadImage, postATechnology);
TechnologyRouter.get("/", getAllTechnologies);
TechnologyRouter.get("/:id", getOneTechnology);
TechnologyRouter.delete("/:id", deleteOneTechnology);
TechnologyRouter.put("/:id",uploadImage, updateOneTechnology);
TechnologyRouter.get("/type/:type", getTechnolgiesByTechType);

export default TechnologyRouter;
