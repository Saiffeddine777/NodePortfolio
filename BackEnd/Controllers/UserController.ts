import { Request, Response } from "express";
import { User } from "../Entities/User";
import {
  createUser,
  findAllUsers,
  findOneUser,
  loginWithToken,
  modifyOneUser,
  removeOneUser,
  signInUser,
  signUpUser,
} from "../Services/UserService";
import { MulterRequest } from "../Types/ExpressTypes";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { JsonWebTokenError } from "jsonwebtoken";
import { isProduction } from "..";

export const postUser: (
  req: MulterRequest<any, any, Partial<User>>,
  res: Response
) => Promise<void> = async (req, res) => {
  try {    
    let fileBuffer: Express.Multer.File | undefined;
    if (req.file) {
       fileBuffer = req.file 
    }
    const user = await createUser(req.body as User , fileBuffer);
    res.status(201).json(user);
  } catch (error) {
    errorhandler(error)
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
    errorhandler(error)
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
        res.cookie("refreshToken",result?.refreshToken , {
          httpOnly : true,
          secure : isProduction ,
          sameSite :isProduction?"none" :"lax",
          maxAge : 7 * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({accessToken: result?.accessToken  ,...result?.user})
       }
      
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error);
  }
}

export const logInWithTokenController :(
  req: Request,
  res: Response
)=>Promise<any> = async (req,res)=>{
  try {
      const cookieString : string | undefined = req.headers["authorization"]

      if (!cookieString){
        return res.status(401).json({message : "token is not found"})
      }
      const token  =  cookieString.split(" ")[1] 
      const result : Partial<User> |string = await loginWithToken(token as string)    

      if (typeof result === "object" && result !== null) {
        return res.status(200).json(result);
      }

      else{
        if (result ==="Invalid Token"){
          return res.status(401).json({message : "User token is expired or invalid "})
        }else if (result ==="User is not found"){
          return res.status(404).json ({message :"User is not found "})
        }
      }
      
  } catch (error) {
    errorhandler(error)
    if (error instanceof JsonWebTokenError){
      return res.status(401).json({message : "User token is expired or invalid "})
    }
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
    errorhandler(error)
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
    errorhandler(error)
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
    errorhandler(error)
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
    errorhandler(error)
    res.status(500).json(error);
  }
};


export const logout : (req: Request, res: Response) => Promise <void> =async (req, res)=>{
  try {
    res.clearCookie("refreshToken" ,
      {
      httpOnly: true,
      secure: false, // change to true in production with HTTPS
      sameSite: "lax",
      }
    ).status(200).json({message : "Logged out successfully"})
  } catch (error) {
    errorhandler(error)
    res.status(500).json(error)
  }
}
