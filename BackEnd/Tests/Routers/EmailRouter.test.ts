jest.mock("../../Middlewares/VerifyAdmin", () => ({
  __esModule: true,
  isAdmin: jest.fn((req: any, res: any, next: any) => next()),
  isValid: jest.fn((req: any, res: any, next: any) => next()),

}));

jest.mock("../../Middlewares/RecaptchaVerification", ()=>({
  __esModule : true,
  verifyRecaptcha : jest.fn((req: any, res: any, next: any) => next()),
}))

jest.mock("../../Controllers/EmailController", () => ({
  getAllEmails: jest.fn(),
  postAnEMail: jest.fn(),
  getOneEmail: jest.fn(),
  deleteOneEmail: jest.fn(),
  putOneEmail: jest.fn(),
   sendEmailController: jest.fn(),

}));

import request from "supertest";
import  testApp  from "../test-server";
import * as EmailController from "../../Controllers/EmailController";
import { Email } from "../../Entities/Email";
import { UserRole } from "../../Entities/User";
import { isAdmin } from "../../Middlewares/VerifyAdmin";
import { DeleteResult } from "typeorm";
import { UpdateResult } from "typeorm/browser";
import { verifyRecaptcha } from "../../Middlewares/RecaptchaVerification";



describe("EmailRouter tests", () => {
   const reqBodyInput: Partial<Email> = {
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
        verified : true,
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
  const mockResult: Email = {
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
      verified :true,
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1690000000/user_avatar.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      emails: [],
    },
    id: 1,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/emails should return all the emails", async () => {
    (isAdmin as jest.Mock).mockImplementation((req: any, res: any, next: any) =>
      next()
    );

    jest
      .spyOn(EmailController, "getAllEmails")
      .mockImplementation(async (req, res) => {
        res.status(200).json([mockResult]);
      });

    const res = await request(testApp).get("/api/emails");
    expect(res.status).toBe(200);

    const normalizedBody = res.body.map((email: any) => ({
      ...email,
      createdAt: new Date(email.createdAt),
      updatedAt: new Date(email.updatedAt),
      user: {
        ...email.user,
        createdAt: new Date(email.user.createdAt),
        updatedAt: new Date(email.user.updatedAt),
      },
    }));
    expect(normalizedBody).toEqual([mockResult]);
  });

  it("GET /api/emails/1 should return one email with the id of 1", async () => {
    (isAdmin as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        next();
      }
    );
    jest
      .spyOn(EmailController, "getOneEmail")
      .mockImplementation(async (req, res) => {
        res.status(200).json(mockResult);
      });
    const res = await request(testApp).get("/api/emails/1");
    expect(res.status).toBe(200);
    const normalisedBody = {
      ...res.body,
      createdAt: new Date(res.body.createdAt),
      updatedAt: new Date(res.body.updatedAt),
      
      user :{
        ...res.body.user,
        createdAt: new Date(res.body.user.createdAt),
        updatedAt: new Date(res.body.user.updatedAt),
      }
    };
    expect(normalisedBody).toEqual(mockResult);
  });


  it ("DELETE /api/emails/1 should delete one email with the id of 1" , async ()=>{
    const deleteResult = {affected :1 } as DeleteResult
    (isAdmin as jest.Mock).mockImplementation((req:any , res:any , next:any)=>{
      next();
    });
    jest.spyOn(EmailController , "deleteOneEmail").mockImplementation(async (req, res)=>{
      res.status(200).json({ message: "Email has been deleted", ...deleteResult })
    });
    const res = await request(testApp).delete("/api/emails/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Email has been deleted", ...deleteResult })
  })


  it ("POST /api/emails/ should create one email when given a body input" , async ()=>{
    (verifyRecaptcha as jest.Mock).mockImplementation((req: any, res: any, next: any) =>
      next()
    );
    jest.spyOn(EmailController , "postAnEMail").mockImplementation(async (req, res)=>{
      res.status(200).json(mockResult)
    });
    const res =  await request(testApp).post("/api/emails/").send(reqBodyInput);
    expect(res.status).toBe(200);
      const normalisedBody = {
      ...res.body,
      createdAt: new Date(res.body.createdAt),
      updatedAt: new Date(res.body.updatedAt),
      
      user :{
        ...res.body.user,
        createdAt: new Date(res.body.user.createdAt),
        updatedAt: new Date(res.body.user.updatedAt),
      }
    };
    expect(normalisedBody).toEqual(mockResult);
  })
  
    it ("PUT /api/emails/1 should modify one email when given a body" , async ()=>{
    const updateResult = {affected:1}as UpdateResult
    (isAdmin  as jest.Mock).mockImplementation((req: any, res :any , next :any)=>{
      next()
    })
    jest.spyOn(EmailController , "putOneEmail").mockImplementation(async (req, res)=>{
      res.status(200).json({ message: "Email has been updated", ...updateResult })
    });
    const res =  await request(testApp).put("/api/emails/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Email has been updated", ...updateResult });
  })

  
});
