import { logInWithTokenController } from "../../../Controllers/UserController";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { loginWithToken } from "../../../Services/UserService";
import { User, UserRole } from "../../../Entities/User";

jest.mock("../../../Services/UserService");
jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("Testing the success and the failure of the function of logInWithTokenController", () => {
  const mockRequest = ({
    body = {},
    params = {},
    headers = { authorization: "Some String value" },
    query = {},
    file = undefined,
  }: {
    body?: any;
    params?: {};
    headers?: { authorization?: string };
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ body, params, query, file, headers } as any);

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
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
  beforeEach(()=>{
    jest.clearAllMocks();
  })

  test("testing the success of logInWithTokenController should send an one User", async () => {
    const req = mockRequest({
      headers: { authorization: "Bearer Some String value" },
    });
    const res = mockResponse();
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    (loginWithToken as jest.Mock).mockResolvedValue(mockUser);
    await logInWithTokenController(req, res);
    expect(loginWithToken).toHaveBeenLastCalledWith(token);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test("testing the failure of logInWithTokenController should send an error", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error: Error = new Error("Error has happened");
    (loginWithToken as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await logInWithTokenController(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
