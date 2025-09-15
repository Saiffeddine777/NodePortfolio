import { Request, Response } from "express";
import Project from "../Entities/Project";
import {
  createOneProject,
  findAllProjects,
  findOneProject,
  modifyOneProject,
  removeOneProject,
} from "../Services/ProjectService";

export const postOneProject: (
  req: Request<any, any, Partial<Project>>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const createdProject = await createOneProject(req.body);
    res.status(200).json(createdProject);
  } catch (error) {
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
    res.status(500).json(error);
    throw error;
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
    res.status(500).json(error);
    throw error;
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
    res.status(500).json(error);
    throw error;
  }
};

export const putOneProject: (
  req: Request<{ id: string }, any, Partial<Project>>,
  res: Response
) => Promise<void | Response> = async (req, res) => {
  try {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "The ID is not valid" });
    }
    const result = await modifyOneProject(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
    throw error;
  }
};
