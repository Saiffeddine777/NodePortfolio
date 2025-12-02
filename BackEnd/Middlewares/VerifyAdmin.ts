import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { UserRepository } from "../Repositories/UserRepository";
import { UserRole } from "../Entities/User";
import { errorhandler } from "../Handlers/ErrorHandlers";

export interface CustomJwtPayLoad extends JwtPayload {
  id?: number;
  email?: string;
  role?: UserRole;
}

export const isAdmin: (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> = async (req, res, next) => {
  try {
    const tokenHeader: string = req.headers["authorization"] as string;

    const token: string = tokenHeader && tokenHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "token is not found" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET as string);
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const payLoad = decoded as CustomJwtPayLoad;

    const user = await UserRepository.findOneBy({ id: payLoad.id });

    if (!(user?.role === payLoad?.role && user?.role === "Admin")) {
      return res.status(403).json({ message: "Forbidden Route" });
    }

    next();
  } catch (error) {
    errorhandler(error);
    if (error instanceof TokenExpiredError) {
      return res.status(401).json(error);
    }
    res.status(500).json({ message: "Internal server Error", error });
  }
};

export const isValid: (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> = async (req, res, next) => {
  try {
    const tokenHeader: string = req.headers["authorization"] as string;
    const token: string = tokenHeader && tokenHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "token is not found" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET as string);
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const payLoad = decoded as CustomJwtPayLoad;

    const user = await UserRepository.findOneBy({ id: payLoad.id });

    if (
      !(user?.role === payLoad?.role && user?.role === "Admin") ||
      user.id !== payLoad?.id
    ) {
      return res.status(403).json({ message: "Forbidden Route" });
    }

    next();
  } catch (error) {
    errorhandler(error);
    if (error instanceof TokenExpiredError) {
      return res.status(401).json(error);
    }
    res.status(500).json({ message: "Internal server Error", error });
  }
};

// export const isValidForFechtingUser :(req : Request, res: Response , next :NextFunction)=>Promise<any>= async(req,res,next)=>{
//     try {
//         const token :string = req.cookies["jwtToken"]
//         if (!token){
//             return res.status(401).json({message : "token is not found"})
//         }

//         const decoded   = jwt.verify(token , process.env.JWT_SECRET as string)
//         if (typeof(decoded) ==="string"){
//             return res.status(401).json({message : "Invalid Token"})
//         }
//         next();
//     } catch (error) {
//         errorhandler(error)
//         res.status(500).json({message:"Internal server Error", error})
//     }
// }
