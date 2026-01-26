import { Response, Request } from "express";
import { PortfolioFile } from "../Entities/PortfolioFile";
import { errorhandler } from "../Handlers/ErrorHandlers";
import {
  createAPortfolioFile,
  findAllPortfolioFiles,
  findCVportfolioFiles,
  findOnePortfolioFile,
  removeAPortfolioFileWithName,
  removeOnePortfolioFile,
} from "../Services/PortfolioFileService";
import { DeleteResult } from "typeorm";
import { MulterRequest } from "../Types/ExpressTypes";

export const postAPortfolioFile: (
  req: MulterRequest<any, Partial<PortfolioFile>>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const blob = req.file;
    const file = req.body;
    const fileCreated: PortfolioFile = await createAPortfolioFile(file, blob);
    res.status(201).json(fileCreated);
  } catch (error) {
    errorhandler(error);
    res.status(500).json(error);
  }
};

export const getAllPortfolioFile: (
  req: Request,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const files: PortfolioFile[] = await findAllPortfolioFiles();
    res.status(200).json(files);
  } catch (error) {
    errorhandler(error);
    res.status(500).json(error);
  }
};

export const getOnePortfolioFile: (
  req: Request<{ id: string }>,
  res: Response
) => Promise<any> = async (req, res) => {
  try {
    const parsedID: number = parseInt(req.params.id);
    if (isNaN(parsedID)) {
      return res.status(400).json({ message: "Unvalid ID value" });
    }
    const file = await findOnePortfolioFile(parsedID);
    res.status(200).json(file);
  } catch (error) {
    errorhandler(error);
    res.status(500).json(error);
  }
};

export const deleteOnePorfolioFile: (
  req: Request<{ id: string }>,
  res: Response
) => Promise<any> = async (req, res) => {
  try {
    const parsedID: number = parseInt(req.params.id);
    if (isNaN(parsedID)) {
      return res.status(400).json({ message: "Unvalid ID value" });
    }
    const result: DeleteResult = await removeOnePortfolioFile(parsedID);
    res.status(200).json(result);
  } catch (error) {
    errorhandler(error);
    res.status(500).json(error);
  }
};

export const deleteOnePorfolioFileWithName: (
  req: Request<{ fileName: string }>,
  res: Response
) => Promise<any> = async (req, res) => {
  try {
   const result = await removeAPortfolioFileWithName(req.params.fileName);
   res.status(200).json(result);
  } catch (error) {
    errorhandler(error);
    res.status(500).json(error);
  }
};



export const getCVPortfolioFile: (
  req: Request<{ itcv :string , fullCv :string}>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const {fullCv , itcv} = req.params
    const files: PortfolioFile[] = await findCVportfolioFiles([fullCv , itcv]);
    res.status(200).json(files);
  } catch (error) {
    errorhandler(error);
    res.status(500).json(error);
  }
};
