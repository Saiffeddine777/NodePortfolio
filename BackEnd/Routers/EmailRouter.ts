import { Router } from "express";
import { deleteOneEmail, getAllEmails, getOneEmail, postAnEMail, putOneEmail } from "../Controllers/EmailController";

const EmailRouter = Router()

EmailRouter.post("/" , postAnEMail)
EmailRouter.get("/", getAllEmails)
EmailRouter.get("/:id" , getOneEmail)
EmailRouter.delete("/:id" , deleteOneEmail)
EmailRouter.put("/:id", putOneEmail)

export default EmailRouter;