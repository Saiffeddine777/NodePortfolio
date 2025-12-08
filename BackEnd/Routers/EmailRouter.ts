import { Router } from "express";
import { deleteOneEmail, getAllEmails, getOneEmail, postAnEMail, putOneEmail } from "../Controllers/EmailController";
import { isAdmin } from "../Middlewares/VerifyAdmin";

const EmailRouter = Router()

EmailRouter.post("/" , postAnEMail)
EmailRouter.get("/", isAdmin,getAllEmails)
EmailRouter.get("/:id" , getOneEmail)
EmailRouter.delete("/:id", isAdmin , deleteOneEmail)
EmailRouter.put("/:id",isAdmin,  putOneEmail)

export default EmailRouter;