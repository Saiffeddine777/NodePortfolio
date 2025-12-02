import { Request, Response } from "express";
import { Technology, TechType } from "../Entities/Technology";
import {
  createATechnologie,
  findAllTechnologies,
  findOneTechnology,
  findTechnologiesByType,
  modifyOneTechnology,
  removeOneTechnology,
} from "../Services/TechnologyService";
import { MulterRequest } from "../Types/ExpressTypes";
import { errorhandler } from "../Handlers/ErrorHandlers";


export const postATechnology: (
  req: MulterRequest<any, any, Partial<Technology>>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    let file : Express.Multer.File |undefined;
    if (req.file){
      file = req.file
    }
    const tech = await createATechnologie(req.body , file);
    res.status(201).json(tech);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
};

export const getAllTechnologies: (
  req: Request,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const techs = await findAllTechnologies();
    res.status(200).json(techs);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
};

export const getTechnolgiesByTechType :(
  req: Request<{type : TechType}>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const techs = await findTechnologiesByType(req.params.type)
    res.status(200).json(techs);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
}

export const getOneTechnology: (
  req: Request<{id:string}>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tech =  await findOneTechnology(id);
    res.status(200).json(tech);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
};

export const deleteOneTechnology: (
  req: Request<{id:string}>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tech =  await removeOneTechnology(id);
    res.status(200).json(tech);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
};

export const updateOneTechnology: (
  req: MulterRequest<{id:string} , any , Partial<Technology>>,
  res: Response
) => Promise<void> = async (req, res) => {  
  try {
    let file : Express.Multer.File |undefined
    if (req.file){
      file = req.file
    }
    const id = parseInt(req.params.id); 
    const data = req.body
    const tech =  await modifyOneTechnology(id ,data , file);
    res.status(200).json(tech);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
};
