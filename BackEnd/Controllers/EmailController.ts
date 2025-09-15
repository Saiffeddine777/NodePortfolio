import { Request, Response } from "express";
import { Email } from "../Entities/Email";
import {
  createAnEmail,
  removeOneEmail,
  findAllEmails,
  findOneEmail,
  updateEmail
} from "../Services/EmailService";

export const postAnEMail: (
  req: Request<any, any, Partial<Email>>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const email: Email = await createAnEmail(req.body);
    res.status(201).json(email);
  } catch (error) {
    res.status(500).json(error);
    throw error;
  }
};

export const getAllEmails: (
  req: Request,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const emails = await findAllEmails();
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getOneEmail: (
  req: Request<{ id: string }>,
  res: Response
) => Promise<Response | void> = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json(new Error("Id is not valid"));
    }
    const emailIfExists = await findOneEmail(id);
    if (!emailIfExists) {
      return res.status(404).json(new Error("Email does not exit"));
    }
    res.status(200).json(emailIfExists);
  } catch (error) {
    res.status(500).json(error);
    throw error;
  }
};

export const deleteOneEmail: (
  req: Request<{ id: string }>,
  res: Response
) => Promise<Response | void> = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json(new Error("Id is not valid"));
    }
    const deleteResult = await removeOneEmail(id);
    res
      .status(200)
      .json({ message: "Email has been deleted", ...deleteResult });
  } catch (error) {
    res.status(500).json(error);
    throw error;
  }
};

export const putOneEmail: (
  req: Request<{ id: string }>,
  res: Response
) => Promise<Response | void> = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json(new Error("Id is not valid"));
    }
    const updateResult = await updateEmail(id);
    res
      .status(200)
      .json({ message: "Email has been updated", ...updateResult });
  } catch (error) {
    res.status(500).json(error);
    throw error;
  }
};



