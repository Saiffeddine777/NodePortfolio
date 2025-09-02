import { Request, Response ,NextFunction } from "express"   
import jwt, { JwtPayload } from "jsonwebtoken"
import { UserRepository } from "../Repositories/User.repository"
import { UserRole } from "../Entities/User"

export interface CustomJwtPayLoad extends JwtPayload{
    id ?:number ,
    email?:string,
    role ?:UserRole
}


export const isAdmin :(req : Request, res: Response , next :NextFunction)=>Promise<any>= async(req,res,next)=>{
    try {
        const token :string = req.cookies["jwtToken"]
        if (!token){
            return res.status(401).json({message : "token is not found"})
        }

        const decoded   = jwt.verify(token , process.env.JWT_SECRET as string)
        if (typeof(decoded) ==="string"){
            return res.status(401).json({message : "Invalid Token"})
        }

        const payLoad = decoded as CustomJwtPayLoad

        const user = await UserRepository.findOneBy({id:payLoad.id})

        if (!(user?.role === payLoad?.role && user?.role === "Admin")) {
            return res.status(403).json({ message: "Forbidden Route" });
        }

        next();      
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server Error", error})
    }
}


export const isValid :(req : Request, res: Response , next :NextFunction)=>Promise<any>= async(req,res,next)=>{
    try {
        const token :string = req.cookies["jwtToken"]
        if (!token){
            return res.status(401).json({message : "token is not found"})
        }

        const decoded   = jwt.verify(token , process.env.JWT_SECRET as string)
        if (typeof(decoded) ==="string"){
            return res.status(401).json({message : "Invalid Token"})
        }

        const payLoad = decoded as CustomJwtPayLoad

        const user = await UserRepository.findOneBy({id:payLoad.id})

        if (!(user?.role === payLoad?.role && user?.role === "Admin")||user.id!==payLoad?.id ){
            return res.status(403).json({ message: "Forbidden Route" });
        }

        next();      
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server Error", error})
    }
}


export const isValidForFechtingUser :(req : Request, res: Response , next :NextFunction)=>Promise<any>= async(req,res,next)=>{
    try {
        const token :string = req.cookies["jwtToken"]
        if (!token){
            return res.status(401).json({message : "token is not found"})
        }

        const decoded   = jwt.verify(token , process.env.JWT_SECRET as string)
        if (typeof(decoded) ==="string"){
            return res.status(401).json({message : "Invalid Token"})
        }
        next();      
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server Error", error})
    }
}

