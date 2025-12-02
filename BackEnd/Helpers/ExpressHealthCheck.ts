import { DataSource } from "../EnvDataSource";
import { Request , Response } from "express";
export const healthCheck  = async (req :Request, res : Response)=>{
  try {
     await DataSource.query("SELECT 1");
    res.status(200).json({status: "Ok" , database :"connected"})
  } catch (error) {
    res.status(500).json({"Internal Server error" :"Express server is not healthy"})
  }
}