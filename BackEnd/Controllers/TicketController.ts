import { Request, Response } from "express";
import { createJiraTicketAndStoreReference, findOneTicket, findTicketsWithPagination, loadProjects, loadTickets, removeOneIssue, updateSolvingOneTicket,  } from "../Services/TicketService";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { handleSendingError } from "../Handlers/ErrorHttpHandler";
import { Ticket } from "../Entities/Ticket";
import { createAnEmail, createAnEmailReponseOnAticket } from "../Services/EmailService";
import { findOneUser } from "../Services/UserService";
import { NullableOrUndefined } from "../Types/UtilityTypes";
import { User } from "../Entities/User";

export const postOneTicket: (
  req: Request<
    any,
    any,
    { keyProject: string; summary: string; description: string; name: string , userId :number }
  >,
  res: Response,
) => Promise<void> = async (req, res) => {
  try {
    const { keyProject, summary, description, name ,userId } = req.body;
    
    const createdTicket  = await createJiraTicketAndStoreReference(
      keyProject,
      summary,
      description,
      name,
      userId,
    ) as Ticket;
    
    const user:NullableOrUndefined<User> = await findOneUser(userId)
    if (! user){
      throw new Error ("User does not exists ");
    }
    const {id, jiraID  } = createdTicket
    await createAnEmail({
      subject: `[${id}][${jiraID}]: ${createdTicket.description}`,
      fromEmail: user?.email,
      user: { id: userId }, 
      body: createdTicket.summary,
      ticket: { id: createdTicket.id }, 
      fromName: user?.firstName,
    })
    
    res.status(200).json({ message: "ticket has been created successfully!" });
  } catch (error) {
    errorhandler(error);
    handleSendingError(error, res);
  }
};

export const getAllProjects :(req:Request , res :Response )=> Promise<void> = async (req, res)=>{
  try {
    const projects = await loadProjects();
    res.status(200).json(projects)
  } catch (error) {
    errorhandler(error);
    handleSendingError(error, res);    
  }
}

export const getAllTickets :(req:Request , res :Response )=> Promise<void> = async (req, res)=>{
  try {
    const projects = await loadTickets();
    res.status(200).json(projects)
  } catch (error) {
    errorhandler(error);
    handleSendingError(error, res);    
  }
}


export const deleteOneTicket :(req:Request<{id:string}> , res :Response )=> Promise<void> = async (req, res)=>{
  try {
    const id :string= req.params.id
    if (!id){
      throw new Error ("Invalid or no ID");
    }
    const result = await removeOneIssue(id)
    res.status(200).json({message: "Jira issue has been deleted" , ...result})
  } catch (error) {
    errorhandler(error);
    handleSendingError(error, res);    
  }
}

export const getOneTicket :(req:Request<{id:string}> , res :Response )=> Promise<void> = async (req, res)=>{
  try {
    const id :string= req.params.id
    if (!id){
      throw new Error ("Invalid or no ID");
    }
    const result = await findOneTicket(id)
    res.status(200).json(result);
  } catch (error) {
    errorhandler(error);
    handleSendingError(error, res);    
  }
}


export const solveOneTicket :(req:Request<{id:string}> , res :Response )=> Promise<void> = async (req, res)=>{
  try {
    const id :string= req.params.id
    const data = req.body

    if (!id){
      throw new Error ("Invalid or no ID");
    }
    const result = await updateSolvingOneTicket(id , data)
    const responseEmail:string = req.body.responseEmail
    const refinedData = data as Ticket
    await createAnEmailReponseOnAticket({
      subject: `[${id}][${refinedData.jiraID}]: ${refinedData.description}`,
      fromEmail: refinedData.user?.email,
      user: { id: refinedData.user?.id }, 
      body: responseEmail,
      ticket: { id }, 
      fromName: refinedData.user?.firstName,
    })
    res.status(200).json({message: "The Ticket has been updated" , result});
  } catch (error) {
    errorhandler(error);
    handleSendingError(error, res);    
  }
}


export const getPaginatedTickets : (req:Request<{limit:string , page:string}> ,res:Response)=>Promise<void> = async (req,res)=>{
  try {
    const limit :number = parseInt(req.params.limit);
    const page :number = parseInt(req.params.page);
    const result = await findTicketsWithPagination(limit , page)
    res.status(200).json(result);
  } catch (error) {
    errorhandler(error);
    handleSendingError(error , res);  
  }
}




