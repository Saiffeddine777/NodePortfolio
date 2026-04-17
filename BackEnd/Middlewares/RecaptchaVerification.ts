import { NextFunction, Request, Response } from "express";
import { errorhandler } from "../Handlers/ErrorHandlers";
import axios, { AxiosResponse } from "axios";

export const verifyRecaptcha: (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const token: string | string[] | undefined = req.headers["recaptcha"];
    if (!token || typeof token !== "string") {
       res.status(400).json({
        message: "Reacaptcha Error",
        reason: "Recaptcha has not poped or there is no token",
      });
      return;
    }
    
    const response :AxiosResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`,
        null
        ,{
        params :{
            secret: process.env.RECAPTCHA_SECRET_KEY as string,
            response: token
        }
        })

    const {action ,success , score} = response.data;
    console.log({action ,success , score})
    if (!success || score<0.5){
        res.status(403).json({message :"Spam has been detected"})
        return;
    }

    if (action !== "contact_form"){
         res.status(403).json({message :"Invalid reCAPTCHA action"})
         return ;
    }
    next()
  } catch (error) {
    console.log(error);
    errorhandler(error);
    res.status(500).json(error);
  }
};
