import { postAnEMail } from "../../../Controllers/EmailController";
import { Email } from "../../../Entities/Email";
import { UserRole } from "../../../Entities/User";
import { createAnEmail } from "../../../Services/EmailService";
jest.mock("../../../Services/EmailService");

const mockRequest = (body: Partial<Email>) => ({ body } as any);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("EmailController testing the controller that handles posting emails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("if post an email is a success", async () => {
    const reqBody: Partial<Email> = {
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
        imageUrl:
          "https://res.cloudinary.com/demo/image/upload/v1690000000/user_avatar.png",
        createdAt: new Date(),
        updatedAt: new Date(),
        emails: [],
      },
    };

    const req = mockRequest(reqBody);
    const res = mockResponse();

    const mockCreatedEmail = {
      ...reqBody,
      id: 1,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (createAnEmail as jest.Mock).mockResolvedValue(mockCreatedEmail)

    await postAnEMail(req,res)
    expect(createAnEmail).toHaveBeenCalledWith(reqBody)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(mockCreatedEmail)

  });

  

  test("if post an email is a failure", async () => {
    const req = mockRequest ({subject : "X"})
    const res = mockResponse()
    const error = new Error("Something happen to this controller");
     (createAnEmail as jest.Mock).mockRejectedValue(error)
     await postAnEMail(req ,res)
     expect(res.status).toHaveBeenCalledWith(500)
     expect(res.json).toHaveBeenCalledWith(error)

  });
});
