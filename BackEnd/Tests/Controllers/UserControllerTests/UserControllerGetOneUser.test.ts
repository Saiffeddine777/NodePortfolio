import { getOneUser } from "../../../Controllers/UserController";
import { User, UserRole } from "../../../Entities/User";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { findOneUser } from "../../../Services/UserService";

jest.mock("../../../Services/UserService");
jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("Testing the success and the failure of the function of getOneUser", () => {
  const mockRequest = ({
    body = {},
    params = { id: 1 },
    query = {},
    file = undefined,
  }: {
    body?: any;
    params?: { id: number };
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ body, params, query, file } as any);

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("testing the success of getOneUser should send an one User", async () => {
    const req = mockRequest({params :{id:1}});
    const res = mockResponse();
    (findOneUser as jest.Mock).mockResolvedValue(mockUser); 
    await getOneUser(req, res);
    expect(findOneUser).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);

  });

  test("testing the failure of getOneUser should send an error", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error: Error = new Error("Some error has happened");
    (findOneUser as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await getOneUser(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
