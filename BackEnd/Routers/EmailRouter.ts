import { Router } from "express";
import * as EmailController from "../Controllers/EmailController";
import { isAdmin } from "../Middlewares/VerifyAdmin";

const EmailRouter = Router()

EmailRouter.post("/" , EmailController.postAnEMail)
EmailRouter.get("/", isAdmin, EmailController.getAllEmails)
EmailRouter.get("/:id" , EmailController.getOneEmail)
EmailRouter.delete("/:id", isAdmin , EmailController.deleteOneEmail)
EmailRouter.put("/:id",isAdmin,  EmailController.putOneEmail)

export default  EmailRouter;