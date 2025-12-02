import { Request, Response } from "express";
import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { errorhandler } from "./Handlers/ErrorHandlers";
import { User } from "./Entities/User";
import { promisify } from "util";


async function verifyAsync<T>(token :string  , secret: string):Promise<T>{
  return (await promisify<string , string, any>(verify)(token, secret)) as T
}

export const refreshTokenController: (
  req: Request,
  res: Response
) => Promise<void> = async (req, res) => {
  try {
    const refreshToken: string = req.cookies.refreshToken;

    const userDecoded = await verifyAsync<Partial<User>>(refreshToken , process.env.REFRESH_JWT_SECRET as string)
    if (userDecoded){
        const {exp , iat , ...cleanPayload} = userDecoded as any
        const newAccessToken = sign(
          { ...(cleanPayload as Object) },
          process.env.ACCESS_JWT_SECRET as string,
          { expiresIn: "15m" }
        );
        res.status(200).json({ newAccessToken });
    }
  } catch (error) {
    errorhandler(error);
    if (error instanceof JsonWebTokenError) res.sendStatus(401)
    else {
      res.status(500).json(error)
    }
  }
};
