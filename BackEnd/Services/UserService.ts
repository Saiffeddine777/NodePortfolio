import { DeleteResult, UpdateResult } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../Entities/User";
import { UserRepository } from "../Repositories/User.repository";
import { passwordGenerator } from "../Helpers/PasswordGenerator";
import jwt from "jsonwebtoken";
import { UploadApiResponse } from "cloudinary";
import {
  deleteFromCloudinary,
  uploadToCLoudinary,
} from "../Adapters/CloudinaryAdapter";
import sendEmail from "../Handlers/NodeMailerHandler";
import { createUserEmailDataFactoryFunction } from "../DataGenerators/EmailData";

export const createUser: (
  user: User,
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
    await sendEmail(
      createUserEmailDataFactoryFunction(
        userCreated.userName,
        generatedPassoword,
        userCreated.email
      )
    );
    return userCreated;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signUpUser: (user: Partial<User>) => Promise<string> = async (
  user
) => {
  try {
    const hashedPassoword = await bcrypt.hash(user.password as string, 10);
    user.password = hashedPassoword;
    const userCreated: User = UserRepository.create(user);
    await UserRepository.save(userCreated);
    return "User has signed up Successfully";
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signInUser: (
  email: string,
  password: string
) => Promise<Object> = async (email, password) => {
  try {
    const user: User | undefined | null = await UserRepository.findOneBy({
      email,
    });
    if (!user) {
      return { message: "This email does not exist" };
    }
    const verification = await bcrypt.compare(password, user.password);
    if (verification) {
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
        },
        token: jwt.sign(
          { id: user.id, email: user.email, role: user.role } as Object,
          process.env.JWT_SECRET as string
        ),
      };
    }
    return { message: "Please verify the password" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findAllUsers: () => Promise<User[] | undefined> = async () => {
  try {
    return await UserRepository.find();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findOneUser: (
  id: number
) => Promise<User | undefined | null> = async (id) => {
  try {
    return await UserRepository.findOneBy({ id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeOneUser: (
  id: number
) => Promise<DeleteResult | undefined> = async (id) => {
  try {
    const userToDelete = await UserRepository.findOneBy({ id });
    if (userToDelete?.publicId) {
      await deleteFromCloudinary(userToDelete.publicId);
    }
    return await UserRepository.delete(id);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    throw error;
  }
};
