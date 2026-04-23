import { Router } from "express";
import * as TicketController from "../Controllers/TicketController";
import { isAdmin } from "../Middlewares/VerifyAdmin";

const TicketRouter = Router ();

TicketRouter.post("/createjiraticket" , TicketController.postOneTicket);
TicketRouter.get("/getjiraprojects" , TicketController.getAllProjects);
TicketRouter.get("/getjiratickets" , TicketController.getAllTickets);  
TicketRouter.delete("/deletejiraticket/:id" , TicketController.deleteOneTicket);
TicketRouter.get("/getonejiraticket/:id" , TicketController.getOneTicket);
TicketRouter.put("/solvejiraticket/:id", TicketController.solveOneTicket);
TicketRouter.get("/getpaginatedtickets/:limit/:page",isAdmin, TicketController.getPaginatedTickets);
 

export default TicketRouter
