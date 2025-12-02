import { getAllEmails } from "../../../Controllers/EmailController";
import { Email } from "../../../Entities/Email";
import { UserRole } from "../../../Entities/User";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { findAllEmails } from "../../../Services/EmailService";

jest.mock("../../../Services/EmailService");

describe("getAllEmails testing findAllEmails that find all emails", () => {
  // Mocks scoped inside describe to avoid Jest collisions
  const mockRequest = (params = {}, query = {}, body = {}) => ({ params, query, body } as any);

  const createMockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("findAllEmails success", async () => {
    const mockResult: Email[] = [
      {
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
          role: UserRole.ADMIN,
          publicId: "user_avatar_123",
          imageUrl: "https://res.cloudinary.com/demo/image/upload/v1690000000/user_avatar.png",
          createdAt: new Date(),
          updatedAt: new Date(),
          emails: [],
        },
        id: 1,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const req = mockRequest();
    const res = createMockResponse();

    (findAllEmails as jest.Mock).mockResolvedValue(mockResult);

    await getAllEmails(req, res);

    expect(findAllEmails).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

test("testing the failure of getAllEmails" , async()=>{
    const req = mockRequest()
    const res = createMockResponse()
    const error = new Error ("This is an error");
    (findAllEmails as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock) = jest.fn()

    await getAllEmails(req,res)
    expect(errorhandler).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(error)
})
});
