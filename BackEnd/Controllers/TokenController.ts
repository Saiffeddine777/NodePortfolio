import { Request, Response } from "express";
import { handleSendingError } from "../Handlers/ErrorHttpHandler";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { findToken } from "../Services/TokenService";
import { testValidity } from "../Helpers/TokenValidity";

export const verifyToken: (
  req: Request<any, any, { token: string }>,
  res: Response,
) => Promise<Response | any> = async (req, res) => {
  try {
    const { token } = req.body;
    const tokenObject = await findToken(token);
    const isValid = testValidity(tokenObject);
    res.status(200).json({ isValid });
  } catch (error) {
    errorhandler(error);
    handleSendingError(error, res);
  }
};

