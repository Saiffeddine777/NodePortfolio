import { Request } from "express";

export interface MulterRequest<
  P = any,       // route params
  ResBody = any, // response body
  ReqBody = any, // request body
  ReqQuery = any // query params
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  file?: Express.Multer.File; // now TS knows req.file exists
}


