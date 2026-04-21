import { Router } from "express";
import * as UserController from "../Controllers/UserController";
import uploadImage from "../Handlers/UploadImageHandler";
import { isAdmin, isValid } from "../Middlewares/VerifyAdmin";
import { verifyRecaptcha } from "../Middlewares/RecaptchaVerification";
import { publicLimiter } from "../Middlewares/PublicLimiter";

const UserRouter = Router();

UserRouter.post("/register" , publicLimiter, verifyRecaptcha(["contact_form"]), UserController.register);
UserRouter.post("/login", publicLimiter, verifyRecaptcha(["login"]), UserController.logIn);
UserRouter.get("/token", UserController.logInWithTokenController);
UserRouter.put("/changepassword"  , UserController.changePassword)
UserRouter.put("/userchangepassword" , isValid , UserController.userChangePassword)
UserRouter.post("/", isAdmin, uploadImage, UserController.postUser);
UserRouter.get("/:id", UserController.getOneUser);
UserRouter.get("/", isAdmin, UserController.getAllUsers);
UserRouter.delete("/:id", isAdmin, UserController.deleteOneUser);
UserRouter.put("/:id", uploadImage, UserController.putOneUser);
UserRouter.post("/logout", UserController.logout);
UserRouter.get("/getpaginatedusers/:limit/:page", UserController.getPaginatedUser)

export default UserRouter;