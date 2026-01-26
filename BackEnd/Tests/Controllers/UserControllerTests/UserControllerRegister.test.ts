import { register } from "../../../Controllers/UserController";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { signUpUser } from "../../../Services/UserService";
import { User, UserRole } from "../../../Entities/User";
import { handleSendingError } from "../../../Handlers/ErrorHttpHandler";

jest.mock("../../../Services/UserService");
jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

jest.mock("../../../Handlers/ErrorHttpHandler", ()=>({
  handleSendingError : jest.fn()
}))

describe("Testing the success and the failure of the function of register", () => {
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

  const mockRequest = ({
    body = {},
    params = {},
    query = {},
    file = undefined,
  }: {
    body?: any;
    params?: any;
    query?: any;
    file?: Express.Multer.File;
  } = {}) =>
    ({
      body,
      params,
      query,
      file,
    }) as any;

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("testing the success of register should signUp One user", async () => {
    const req = mockRequest({ body: mockUserInputSignUp });
    const res = mockResponse();
    (signUpUser as jest.Mock).mockResolvedValue({
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await register(req, res);
    expect(signUpUser).toHaveBeenCalledWith(mockUserInputSignUp);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
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
      updatedAt: expect.any(Date)
    });
  });

  test("testing the failure of register should send an error", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error: Error = new Error("Error has happened");
    (signUpUser as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    (handleSendingError as jest.Mock).mockImplementation()
    await register(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(handleSendingError).toHaveBeenCalledWith(error , res)
  });
});
