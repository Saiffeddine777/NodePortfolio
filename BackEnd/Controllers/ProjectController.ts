import e, { Request, Response } from "express";
import Project from "../Entities/Project";
import {
  createOneProject,
  findAllProjects,
  findOneProject,
  modifyOneProject,
  removeOneProject,
} from "../Services/ProjectService";
import { MulterRequest } from "../Types/ExpressTypes";
import { errorhandler } from "../Handlers/ErrorHandlers";

export const postOneProject: (
  req: MulterRequest<any, any, Partial<Project>>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    if (req.file){
      req.body.techStack = ((req.body.techStack ?? "") as string).split(",").map(e=>e.trim())
    }
    const file = req.file
    const createdProject = await createOneProject(req.body , file);
    res.status(200).json(createdProject);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
    
  }
};

export const getOneProject: (
  req: Request<{ id: string }>,
  res: Response
) => Promise<Response | void> = async (req, res) => {
  try {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "The is not valid" });
    }
    const project = await findOneProject(id);
    res.status(200).json(project);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
};

export const getAllProjects: (
  req: Request,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const projects = await findAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
};

export const deleteOneProject: (
  req: Request<{ id: string }>,
  res: Response
) => Promise<void | Response> = async (req, res) => {
  try {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "The ID is not valid" });
    }
    const result = await removeOneProject(id);
    res
      .status(200)
      .json({ message: "The Project has been deleted", ...result });
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
};

export const putOneProject: (
  req: MulterRequest<{ id: string }, any, Partial<Project>>,
  res: Response
) => Promise<void | Response> = async (req, res) => {
  try {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "The ID is not valid" });
    }
    const file = req.file
    const result = await modifyOneProject(id, req.body ,file);
    res.status(200).json(result);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
};
