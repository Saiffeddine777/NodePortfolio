import type { ApiRequestStatus } from "./Utilities";

export enum UserRole {
  ADMIN = "Admin",
  VISITOR = "Visitor"
}

export interface User {
  id?: number;
  userName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  occupation: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  createdAt ?: Date,
  updatedAt ?: Date,
  imageUrl?: string ,
  publicId ?: string,
  file ?: File |null
}


export interface UserAuthAPiType{
  error:unknown ,
  status : ApiRequestStatus,
  authUser : User|null
}




export type SignInData = {email :string , password: string}