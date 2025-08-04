import { Router } from "express";
import {
  deleteOneUser,
  getAllUsers,
  getOneUser,
  logIn,
  postUser,
  putOneUser,
  register,
} from "../Controllers/UserController";
import { isAdmin, isValid } from "../Middlewares/VerifyAdmin";

const UserRouter = Router();

// UserRouter.post("/", isAdmin, postUser);
// UserRouter.get("/:id", getOneUser);
// UserRouter.get("/", isAdmin, getAllUsers);
// UserRouter.delete("/:id", isValid, deleteOneUser);
// UserRouter.put("/:id", isValid, putOneUser);
// UserRouter.post("/register", register);
// UserRouter.post("/login", logIn);

UserRouter.post("/", postUser);
UserRouter.get("/:id", getOneUser);
UserRouter.get("/",  getAllUsers);
UserRouter.delete("/:id", deleteOneUser);
UserRouter.put("/:id", putOneUser);
UserRouter.post("/register", register);
UserRouter.post("/login", logIn);

export default UserRouter;
