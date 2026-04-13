import { Response } from "express";
import { QueryFailedError } from "typeorm";
import { PostGresError } from "../Types/UtilityTypes";

export const handleSendingError: (
  error: any,
  res: Response,
) => Promise<void> = async (error, res) => {
  if (error instanceof QueryFailedError) {
    const postGressError = error.driverError as PostGresError;
    switch (postGressError.code) {
      case "23505":
        res.status(409).json({ 
            reason: "Duplicate error", 
            duplicate : postGressError.detail,
            error });
        return;
      default:
        res.status(500).json({ reason: "Database error", error });
        return;
    }
  }
  res.status(500).json({
    message: "Internal server error", error
  });
};
