import { Router } from "express";
import {
  deleteOneUser,
  getAllUsers,
  getOneUser,
  logIn,
  logInWithTokenController,
  logout,
  postUser,
  putOneUser,
  register,
} from "../Controllers/UserController";
import uploadImage from "../Handlers/UploadImageHandler";
import { isAdmin } from "../Middlewares/VerifyAdmin";

export const UserRouter = Router();

UserRouter.post("/register", register);
UserRouter.post("/login", logIn);
UserRouter.get("/token", logInWithTokenController)
UserRouter.post("/",isAdmin,uploadImage, postUser);
UserRouter.get("/:id", getOneUser);
UserRouter.get("/" ,isAdmin,  getAllUsers);
UserRouter.delete("/:id",isAdmin, deleteOneUser);
UserRouter.put("/:id",uploadImage, putOneUser);
UserRouter.post("/logout" , logout)
