import { DeleteResult, UpdateResult } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../Entities/User";
import { UserRepository } from "../Repositories/UserRepository";
import { passwordGenerator } from "../Helpers/PasswordGenerator";
import jwt, { SignOptions } from "jsonwebtoken";

import { UploadApiResponse } from "cloudinary";
import {
  deleteFromCloudinary,
  uploadToCLoudinary,
} from "../Adapters/CloudinaryAdapter";
import { sendEmail } from "../Handlers/NodeMailerHandler";
import { createUserEmailDataFactoryFunction } from "../DataGenerators/EmailData";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { CustomJwtPayLoad } from "../Middlewares/VerifyAdmin";
import { NullableOrUndefined } from "../Types/UtilityTypes";
import { generateToken } from "../Adapters/GenerateToken";

export const createUser: (
  user: Partial<User>,
  userImage?: Express.Multer.File
) => Promise<Partial<User> | undefined> = async (user, userImage) => {
  try {
    const generatedPassoword: string = passwordGenerator();
    const hashedPassword: string = await bcrypt.hash(
      generatedPassoword,
      parseInt(process.env.BCRYPT_SALT as string)
    );
    user.password = hashedPassword;
    const cloudinaryUploadResult: UploadApiResponse | undefined =
      await uploadToCLoudinary(userImage);
    const userCreated: User = UserRepository.create({
      ...user,
      publicId: cloudinaryUploadResult?.public_id,
      imageUrl: cloudinaryUploadResult?.url,
    });
    await UserRepository.save(userCreated);
    userCreated.password = generatedPassoword;
    const emailingObj = createUserEmailDataFactoryFunction(
      userCreated.userName,
      generatedPassoword,
      userCreated.email
    );
    await sendEmail(emailingObj);
    return userCreated;
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const signUpUser: (user: Partial<User>) => Promise<string> = async (
  user
) => {
  try {
    const hashedPassoword = await bcrypt.hash(user.password as string, parseInt(process.env.BCRYPT_SALT as string ));
    const userToCreate =  { ...user, password :hashedPassoword }
    const userCreated: User = UserRepository.create(userToCreate);
    await UserRepository.save(userCreated);
    return "User has signed up Successfully";
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const signInUser: (
  email: string,
  password: string
) => Promise<Object> = async (email, password) => {
  try {
    const user: NullableOrUndefined<User> = await UserRepository.findOneBy({
      email,
    });
    if (!user) {
      return { message: "This email does not exist" };
    }
    const verification = await bcrypt.compare(password, user.password);
    if (verification) {
      const refreshToken: string = generateToken(
        user,
        process.env.REFRESH_JWT_SECRET as string,
        "7d"
      );
      const accessToken: string = generateToken(
        user,
        process.env.ACCESS_JWT_SECRET as string,
        "15m"
      );
      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          email: user.email,
          occupation: user.occupation,
          userName: user.userName,
          phoneNumber: user.phoneNumber,
          publicId: user.publicId,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        refreshToken,
        accessToken,
      };
    }
    return { message: "Please verify the password" };
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const loginWithToken: (
  cookieString: string
) => Promise<Partial<User> | string> = async (cookieString) => {
  try {
    const decoded = jwt.verify(
      cookieString,
      process.env.ACCESS_JWT_SECRET as string
    );
    if (typeof decoded === "string") {
      return "Invalid Token";
    }
    const payLoad = decoded as CustomJwtPayLoad;
    const user: NullableOrUndefined<User> = await UserRepository.findOneBy({
      id: payLoad.id,
    });
    if (user) {
      const {password , ...noPasswordUser} = user
      return  noPasswordUser;
    }
    return "User is not found";
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findAllUsers: () => Promise<User[] | undefined> = async () => {
  try {
    return await UserRepository.find();
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findOneUser: (
  id: number
) => Promise<NullableOrUndefined<User>> = async (id) => {
  try {
    return await UserRepository.findOneBy({ id });
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const removeOneUser: (
  id: number
) => Promise<DeleteResult | undefined> = async (id) => {
  try {
    const userToDelete = await UserRepository.findOneBy({ id });
    await deleteFromCloudinary(userToDelete?.publicId);
    return await UserRepository.delete(id);
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const modifyOneUser: (
  id: number,
  data: Partial<User>,
  userImage?: Express.Multer.File
) => Promise<UpdateResult | undefined> = async (id, data, userImage) => {
  try {
    if (userImage) {
      const userToDeleteTheImageOf: User | null =
        await UserRepository.findOneBy({ id });
      userToDeleteTheImageOf?.publicId
        ? await deleteFromCloudinary(userToDeleteTheImageOf.publicId)
        : undefined;
      const result = await uploadToCLoudinary(userImage);
      data.publicId = result?.public_id;
      data.imageUrl = result?.url;
    }
    return await UserRepository.update(id, data);
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};
