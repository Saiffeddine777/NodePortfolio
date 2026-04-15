import { getOneEmail } from "../../../Controllers/EmailController";
import { Email } from "../../../Entities/Email";
import { UserRole } from "../../../Entities/User";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { findOneEmail } from "../../../Services/EmailService";
jest.mock("../../../Services/EmailService");

jest.mock("../../../Handlers/ErrorHandlers", ()=>({
  errorhandler : jest.fn()
}))

describe("EmailController testing the getOneEmail function should it fail or successed ", () => {
  const mockRequest = ({
    body = {},
    params = { id: 1 },
    query = {},
  }: {
    body?: {};
    params?: { id: number };
    query?: {};
  } = {}) => ({ body, params, query } as any);
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getOneEmail in case of success it should respond with an email when given Id", async () => {
    const mockResult: Partial<Email> = {
      subject: "test Subject",
      body: "Testing the test of testing prowess",
      fromName: "tester",
      fromEmail: "testing@gmail.com",
      user: {
        id: 1,
        userName: "luna_code",
        email: "luna.code@example.com",
        phoneNumber: "+1987654321",
        password: "hashed_password_mock",
        occupation: "Backend Engineer",
        firstName: "Luna",
        lastName: "Morales",
        verified :true,
        role: UserRole.ADMIN,
        publicId: "user_avatar_123",
        imageUrl:
          "https://res.cloudinary.com/demo/image/upload/v1690000000/user_avatar.png",
        createdAt: new Date(),
        updatedAt: new Date(),
        emails: [],
         tickets: [],
      },
      id: 1,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const req = mockRequest({ params: { id: 1 } });
    const res = mockResponse();
    (findOneEmail as jest.Mock).mockReturnValue(mockResult);

    await getOneEmail(req, res);
    expect(findOneEmail).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  test("getOneEmail in case of error it should respond with an email when given Id", async () => {
    const req = mockRequest({ params: { id: 1 } });
    const res = mockResponse();
    const error = new Error("Some Errror happened");
    (findOneEmail as jest.Mock).mockRejectedValue(error)
    await getOneEmail(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
