import CloudinaryAdapter, {
  uploadToCLoudinary,
  deleteFromCloudinary,
} from "../../Adapters/CloudinaryAdapter";
import { createUserEmailDataFactoryFunction } from "../../DataGenerators/EmailData";
import { User, UserRole } from "../../Entities/User";
import { sendEmail } from "../../Handlers/NodeMailerHandler";
import { passwordGenerator } from "../../Helpers/PasswordGenerator";
import { UserRepository } from "../../Repositories/UserRepository";
import {
  createUser,
  loginWithToken,
  removeOneUser,
  modifyOneUser,
  findAllUsers,
  findOneUser,
  signInUser,
  signUpUser,
} from "../../Services/UserService";
import bcrypt from "bcrypt";
import { EmailInterface } from "../../Types/UtilityTypes";
import { DeleteResult, UpdateResult } from "typeorm";
import { UploadApiResponse } from "cloudinary";
import { generateToken } from "../../Adapters/GenerateToken";
import jwt from "jsonwebtoken";

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password_mock"),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn().mockReturnValue({
    id: 1,
    email: "luna.code@example.com",
    role: UserRole.ADMIN,
  }),
}));

jest.mock("../../Handlers/NodeMailerHandler", () => ({
  sendEmail: jest.fn().mockResolvedValue("Email sent"),
}));

jest.mock("../../Adapters/GenerateToken", () => ({
  generateToken: jest.fn().mockReturnValue("Some token string"),
}));

jest.mock("../../DataGenerators/EmailData", () => ({
  createUserEmailDataFactoryFunction: jest.fn().mockReturnValue({
    subject: `Welcome to Saif's portfolio`,
    to: "email",
    text: `
               Hello 
               
               We hope tha you are doing fine
               You are now a member of Saif's portfolio 
               This is your password 
               
               password
               Make sure to not use it and for security purposes plaese delete this message 
               
               Best Regards
               `,
  }),
}));

jest.mock("../../Adapters/CloudinaryAdapter", () => ({
  uploadToCLoudinary: jest.fn().mockResolvedValue({
    url: "https://res.cloudinary.com/demo/image/upload/v1690000000/user_avatar.png",
    public_id: "user_avatar_123",
  }),
  deleteFromCloudinary: jest.fn().mockResolvedValue({
    message: "Example message",
    http_code: 200,
  }),
}));

jest.mock("../../Helpers/PasswordGenerator", () => ({
  passwordGenerator: jest.fn().mockReturnValue("password12"),
}));

describe("UserService testing", () => {
  const mockFileToCloudinary: Express.Multer.File | undefined = {
    fieldname: "file",
    originalname: "test-image.png",
    encoding: "7bit",
    mimetype: "image/png",
    buffer: Buffer.from("dummy image data"),
    size: 1234,
    destination: "/uploads",
    filename: "test-image.png",
    path: "/uploads/test-image.png",
    stream: undefined as any,
  };

  const mockFileToCloudinary2: Express.Multer.File | undefined = {
    fieldname: "file1",
    originalname: "test-image.png",
    encoding: "7bit",
    mimetype: "image/png",
    buffer: Buffer.from("dummy image data"),
    size: 1234,
    destination: "/uploads",
    filename: "test-image.png",
    path: "/uploads/test1-image.png",
    stream: undefined as any,
  };

  const mockUserInput: Partial<User> = {
    userName: "luna_code",
    email: "luna.code@example.com",
    phoneNumber: "+1987654321",
    occupation: "Backend Engineer",
    firstName: "Luna",
    lastName: "Morales",
    role: UserRole.ADMIN,
  };
  const mockUserInputSignUp: Partial<User> = {
    userName: "luna_code",
    email: "luna.code@example.com",
    phoneNumber: "+1987654321",
    occupation: "Backend Engineer",
    firstName: "Luna",
    password: "password12676",
    lastName: "Morales",
    role: UserRole.ADMIN,
  };
  const mockUserInput2: Partial<User> = {
    userName: "max_dev",
    email: "max.dev@example.com",
    phoneNumber: "+1234567890",
    occupation: "Fullstack Developer",
    firstName: "Max",
    lastName: "Johnson",
    role: UserRole.VISITOR,
  };

  const mockUser: Partial<User> = {
    id: 1,
    userName: "luna_code",
    email: "luna.code@example.com",
    phoneNumber: "+1987654321",
    password: "hashed_password_mock",
    occupation: "Backend Engineer",
    firstName: "Luna",
    lastName: "Morales",
    role: UserRole.ADMIN,
    publicId: "user_avatar_123",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1690000000/user_avatar.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BCRYPT_SALT = "10";
    process.env.ACCESS_JWT_SECRET = "ACCESS_JWT_SECRET";
    process.env.REFRESH_JWT_SECRET = "REFRESH_JWT_SECRET";
  });

  test("createUser should create the User instance", async () => {
    jest.spyOn(UserRepository, "create").mockReturnValue(mockUser as User);
    jest.spyOn(UserRepository, "save").mockResolvedValue(mockUser as User);
    const result: Partial<User> | undefined = await createUser(
      mockUserInput,
      mockFileToCloudinary,
    );
    expect(passwordGenerator).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith("password12", 10);
    expect(createUserEmailDataFactoryFunction).toHaveBeenCalledWith(
      mockUser.userName,
      "password12",
      mockUser.email,
    );
    expect(sendEmail).toHaveBeenCalledWith({
      subject: `Welcome to Saif's portfolio`,
      to: "email",
      text: `
               Hello 
               
               We hope tha you are doing fine
               You are now a member of Saif's portfolio 
               This is your password 
               
               password
               Make sure to not use it and for security purposes plaese delete this message 
               
               Best Regards
               `,
    } as EmailInterface);
    expect(uploadToCLoudinary).toHaveBeenCalledWith(mockFileToCloudinary);
    expect(UserRepository.create).toHaveBeenCalledWith({
      password: "hashed_password_mock",
      publicId: "user_avatar_123",
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1690000000/user_avatar.png",
      ...mockUserInput,
    });
    expect(UserRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  test("findAllUsers should return all the users of the database", async () => {
    jest.spyOn(UserRepository, "find").mockResolvedValue([mockUser as User]);
    const result: User[] | undefined = await findAllUsers();
    expect(UserRepository.find).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  });

  test("findOneUser should return one user when given the ID as a number", async () => {
    jest.spyOn(UserRepository, "findOneBy").mockResolvedValue(mockUser as User);
    const result = await findOneUser(1);
    expect(UserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockUser);
  });

  test("removeOneUser should remove the user whern given ID", async () => {
    const mockResult = { affected: 1 };
    jest.spyOn(UserRepository, "findOneBy").mockResolvedValue(mockUser as User);
    jest
      .spyOn(UserRepository, "delete")
      .mockResolvedValue({ affected: 1 } as DeleteResult);
    const result = await removeOneUser(1);
    expect(UserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(deleteFromCloudinary).toHaveBeenCalledWith(mockUser.publicId);
    expect(UserRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockResult);
  });

  test("modifyOneUser should modify Useer entity when given the Id and user data", async () => {
    jest.spyOn(CloudinaryAdapter, "uploadToCLoudinary").mockResolvedValue({
      url: "https://res.cloudinary.com/demo/image/upload/v123456/test.png",
      public_id: "test_123",
    } as UploadApiResponse);

    const mockResult = { affected: 1 };
    jest.spyOn(UserRepository, "findOneBy").mockResolvedValue(mockUser as User);
    jest
      .spyOn(UserRepository, "update")
      .mockResolvedValue({ affected: 1 } as UpdateResult);
    const result = await modifyOneUser(
      1,
      mockUserInput2,
      mockFileToCloudinary2,
    );
    expect(UserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(deleteFromCloudinary).toHaveBeenCalledWith(mockUser.publicId);
    expect(uploadToCLoudinary).toHaveBeenCalledWith(mockFileToCloudinary2);
    expect(UserRepository.update).toHaveBeenCalledWith(1, {
      publicId: "test_123",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v123456/test.png",
      ...mockUserInput2,
    });
    expect(result).toEqual(mockResult);
  });

  test("signInUser make sure to sign in a user when given a user data", async () => {
    jest.spyOn(UserRepository, "findOneBy").mockResolvedValue(mockUser as any);

    const result = await signInUser("email@gmail.com", "password12");
    expect(UserRepository.findOneBy).toHaveBeenCalledWith({
      email: "email@gmail.com",
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password12",
      mockUser.password,
    );
    expect(generateToken).toHaveBeenCalledWith(
      mockUser,
      "REFRESH_JWT_SECRET",
      "7d",
    );
    expect(generateToken).toHaveBeenCalledWith(
      mockUser,
      "ACCESS_JWT_SECRET",
      "15m",
    );

    const { password, ...minusPassword } = mockUser;

    expect(result).toEqual({
      user: minusPassword,
      refreshToken: "Some token string",
      accessToken: "Some token string",
    });
  });

  test("loginWithToken shoudld get the token verified an sign the user in again", async () => {
    jest.spyOn(UserRepository, "findOneBy").mockResolvedValue(mockUser as User);
    const result = await loginWithToken("sometokenString");
    expect(jwt.verify).toHaveBeenCalledWith(
      "sometokenString",
      "ACCESS_JWT_SECRET",
    );
    expect(UserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    const { password, ...minusPassword } = mockUser;
    expect(result).toEqual(minusPassword);
  });

  test("signUpUser when given basic data this should send the ", async () => {
    jest
      .spyOn(UserRepository, "create")
      .mockImplementation((data) => data as User);
    jest.spyOn(UserRepository, "save").mockResolvedValue(mockUser as User);
    const result = await signUpUser(mockUserInputSignUp);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInputSignUp.password, 10);
    expect(UserRepository.create).toHaveBeenCalledWith({
      password: "hashed_password_mock",
      ...mockUserInput,
    });
    expect(UserRepository.save).toHaveBeenCalledWith({
      ...mockUserInput,
      password: "hashed_password_mock",
    });
    expect(result).toEqual({
      id: 1,
      userName: "luna_code",
      email: "luna.code@example.com",
      phoneNumber: "+1987654321",
      occupation: "Backend Engineer",
      firstName: "Luna",
      lastName: "Morales",
      role: UserRole.ADMIN,
      publicId: "user_avatar_123",
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1690000000/user_avatar.png",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
