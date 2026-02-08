import { Router } from "express";
import * as EmailController from "../Controllers/EmailController";
import { isAdmin } from "../Middlewares/VerifyAdmin";
import { verifyRecaptcha } from "../Middlewares/RecaptchaVerification";
import { publicLimiter } from "../Middlewares/PublicLimiter";

const EmailRouter = Router()

EmailRouter.post("/"  ,publicLimiter, verifyRecaptcha , EmailController.postAnEMail)
EmailRouter.get("/", isAdmin, EmailController.getAllEmails)
EmailRouter.get("/:id" , EmailController.getOneEmail)
EmailRouter.delete("/:id", isAdmin , EmailController.deleteOneEmail)
EmailRouter.put("/:id",isAdmin,  EmailController.putOneEmail)
EmailRouter.post("/send" , EmailController.sendEmailController)

export default  EmailRouter;