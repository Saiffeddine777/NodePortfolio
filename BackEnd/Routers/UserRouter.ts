import { Router } from "express";
import { deleteOneUser, getAllUsers, getOneUser, postUser ,putOneUser } from "../Controllers/UserController";


const UserRouter = Router()

UserRouter.post("/" , postUser)
UserRouter.get("/:id" , getOneUser)
UserRouter.get("/" , getAllUsers)
UserRouter.delete("/:id" , deleteOneUser)
UserRouter.put("/:id" , putOneUser)


export default UserRouter