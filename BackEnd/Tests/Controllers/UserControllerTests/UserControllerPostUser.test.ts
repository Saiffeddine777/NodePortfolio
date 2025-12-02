import { postUser } from "../../../Controllers/UserController";
import { User, UserRole } from "../../../Entities/User";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { createUser } from "../../../Services/UserService";

jest.mock("../../../Services/UserService");
jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("Testing the success and the failure of the function of postUser", () => {
  const mockRequest = ({
    body = {},
    params = {},
    query = {},
    file = undefined,
  }: {
    body?: any;
    params?: {};
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ body, params, query, file } as any);

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };
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
  const mockUserInput: Partial<User> = {
    userName: "luna_code",
    email: "luna.code@example.com",
    phoneNumber: "+1987654321",
    occupation: "Backend Engineer",
    firstName: "Luna",
    lastName: "Morales",
    role: UserRole.ADMIN,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("testing the success of postUser should send an one created User", async () => {
    const req = mockRequest({
      body: mockUserInput,
      file: mockFileToCloudinary,
    });
    const res = mockResponse();
    (createUser as jest.Mock).mockResolvedValue(mockUser);
    await postUser(req, res);
    expect(createUser).toHaveBeenCalledWith(
      mockUserInput,
      mockFileToCloudinary
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test("testing the failure of postUser should send an error", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error: Error = new Error("Some error has happened");
    (createUser as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await postUser(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
