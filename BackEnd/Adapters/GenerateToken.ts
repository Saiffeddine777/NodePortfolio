import { User } from "../Entities/User";
import jwt from "jsonwebtoken";
export const generateToken = (
  user: User,
  secret: string,
  expirationString?: any
) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role } as Object,
    secret,
    { expiresIn: expirationString }
  );
