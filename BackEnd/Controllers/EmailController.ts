import { Request, Response } from "express";
import { Email } from "../Entities/Email";
import {
  createAnEmail,
  removeOneEmail,
  findAllEmails,
  findOneEmail,
  updateEmail,
  findEmailsWithPagination
} from "../Services/EmailService";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { handleSendingForgetPasswordEmail } from "../SpecialServices/HandleSendingForgetPassword";
import { handleSendingError } from "../Handlers/ErrorHttpHandler";

export const postAnEMail: (
  req: Request<any, any, Partial<Email>>, 
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const email: Email = await createAnEmail(req.body);
    res.status(201).json(email);
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
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
    errorhandler(error)
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
    errorhandler(error)
    res.status(500).json(error);
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
    errorhandler(error)
    res.status(500).json(error);
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
    errorhandler(error)
    res.status(500).json(error);
  }
};

export const sendEmailController: (
  req: Request<any, any ,{from : "change"| "forget" , email: string}>,
  res:Response
)=>Promise<Response|void> =async (req, res)=>{
  try {
     const nature = req.body.from; 
     const email = req.body.email;
     const url = req.get("origin") as string
     if (nature ==="forget"){
       await handleSendingForgetPasswordEmail(email, url)
     }
     
     res.status(200).json({message : "Message email has been issued"});
    
  } catch (error) {
    errorhandler(error);
    handleSendingError(error, res); 
  }
} 


export const getPaginatedEmails :(req :Request<{limit:string, page:string}>, res:Response)=>Promise<void> = async (req, res)=>{
  try {
    const limit : number = parseInt(req.params.limit);
    const page : number = parseInt (req.params.page);
    const result = await findEmailsWithPagination(limit, page);
    res.status(200).json(result)
  } catch (error) {
    errorhandler(error);
    handleSendingError(error , res);
  } 
}



