import { Router } from "express";
import * as TicketController from "../Controllers/TicketController";

const TicketRouter = Router ();

TicketRouter.post("/createjiraticket" , TicketController.postOneTicket);
TicketRouter.get("/getjiraprojects" , TicketController.getAllProjects);
TicketRouter.get("/getjiratickets" , TicketController.getAllTickets);  
TicketRouter.delete("/deletejiraticket/:id" , TicketController.deleteOneTicket);
TicketRouter.get("/getonejiraticket/:id" , TicketController.getOneTicket);
TicketRouter.put("/solvejiraticket/:id", TicketController.solveOneTicket);
 

export default TicketRouter
