import { NextFunction, Request, Response } from "express";
import { errorhandler } from "../Handlers/ErrorHandlers";
import axios, { AxiosResponse } from "axios";

export const verifyRecaptcha = (allowedActions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token: string | string[] | undefined = req.headers["recaptcha"];

      if (!token || typeof token !== "string") {
        res.status(400).json({
          message: "Recaptcha Error",
          reason: "No recaptcha token provided",
        });
        return;
      }

      const response: AxiosResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY as string,
            response: token,
          },
        }
      );

      const { action, success, score } = response.data;

      if (!success || score < 0.5) {
        res.status(403).json({ message: "Spam has been detected" });
        return;
      }

      if (!allowedActions.includes(action)) {
        res.status(403).json({ message: "Invalid reCAPTCHA action" });
        return;
      }

      next();
    } catch (error) {
      console.log(error);
      errorhandler(error);
      res.status(500).json(error);
    }
  };
};