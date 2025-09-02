import { Request, Response } from "express";
import { User } from "../Entities/User";
import {
  createUser,
  findAllUsers,
  findOneUser,
  modifyOneUser,
  removeOneUser,
  signInUser,
  signUpUser,
} from "../Services/UserService";
import { MulterRequest } from "../Types/ExpressTypes";

export const postUser: (
  req: MulterRequest<any, any, Partial<User>>,
  res: Response
) => Promise<void> = async (req, res) => {
  console.log(req.file)
  try {    
    let fileBuffer: Express.Multer.File | undefined;
    if (req.file) {
       fileBuffer = req.file 
    }
    const user = await createUser(req.body as User , fileBuffer);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json(error);
  }
};

export const register: (
  req: Request<any, any, Partial<User>>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {    
    const result = await signUpUser(req.body as User);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error sign up user:", error);
    res.status(500).json(error);
  }
};

export const logIn :(
  req: Request<any, any, {email:string , password:string}>,
  res: Response
)=>Promise<void> = async (req,res)=>{
  try {
      const result :any= await signInUser(req.body.email , req.body.password)
      if (result?.message){
        res.status(result.message==="This email does not exist"?404 :400).json(result)
      }
      else{
        res.cookie("jwtToken",result?.token).status(200).json(result?.user)
      }
      
  } catch (error) {
    console.error("Error signning In:", error);
    res.status(500).json(error);
  }
}

export const getOneUser: (
  req: Request<{ id: string }>,
  res: Response
) => Promise<any> = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "User Id is Invalid" });
    }
    const user: User | undefined | null = await findOneUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json(error);
  }
};

export const getAllUsers: (
  req: Request,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json(error);
  }
};

export const deleteOneUser: (
  req: Request<{ id: string }>,
  res: Response
) => Promise<any> = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const result = await removeOneUser(userId);
    if (result?.affected) {
      return res.status(200).json({ message: "User has been deleted" });
    }
    return res
      .status(400)
      .json({ message: "deletion Gone Wrong Check the data" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json(error);
  }
};

export const putOneUser: (
  req: MulterRequest<{ id: string }, any, Partial<User>>,
  res: Response
) => Promise<any> = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    let fileBuffer : Express.Multer.File | undefined;
    if (req.file){
      fileBuffer =req.file
    }
    const result = await modifyOneUser(userId, req.body , fileBuffer);
    if (result?.affected) {
      return res.status(200).json({ message: "User has been modified" });
    }
    return res
      .status(400)
      .json({ message: "Updating Gone Wrong Check the data" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json(error);
  }
};
