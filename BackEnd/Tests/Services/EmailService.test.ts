import { Email } from "../../Entities/Email";
import { EmailRepository } from "../../Repositories/EmailRepository";
import {
  createAnEmail,
  findAllEmails,
  findOneEmail,
  removeOneEmail,
  updateEmail,
} from "../../Services/EmailService";
import nodemailer from "nodemailer";  // ADD THIS

// ADD THIS BLOCK
jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ messageId: "mocked-id" }),
    }),
  },
}));

jest.mock("../../Repositories/EmailRepository", () => ({
  __esModule: true,
  EmailRepository: {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

describe("EmailService Test", () => {
  const mockUser = {
    id: 17,
    userName: "luna_code",
    email: "luna.code@example.com",
    firstName: "Luna",
    lastName: "Morales",
    role: "Admin",
  } as any;

  const mockEmail: Partial<Email> = {
    id: 1,
    subject: "Test Email",
    body: "This is a test email",
    fromEmail: "he@example.com",
    fromName: "me@example.com",
    user: mockUser,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Create Email should creation of the email", async () => {
    (EmailRepository.create as jest.Mock).mockReturnValue(mockEmail);
    (EmailRepository.save as jest.Mock).mockResolvedValue(mockEmail);
    const result = await createAnEmail(mockEmail);
    expect(EmailRepository.create).toHaveBeenCalledWith(mockEmail);
    expect(result.user.id).toBe(17);
    expect(result.user.email).toBe("luna.code@example.com");
  });

  test("findAllEmail should return all emails", async () => {
    (EmailRepository.find as jest.Mock).mockResolvedValue([mockEmail]);
    const result = await findAllEmails();
    expect(EmailRepository.find).toHaveBeenCalledWith();
    expect(result).toEqual([mockEmail]);
  });

  test("findOne email by ID", async () => {
    (EmailRepository.findOneBy as jest.Mock).mockResolvedValue(mockEmail);
    const result = await findOneEmail(1);
    expect(EmailRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockEmail);
  });

  test("removeOneEmail should delete an email By Id", async () => {
    const deleteResult = { affected: 1 } as any;
    (EmailRepository.delete as jest.Mock).mockResolvedValue(deleteResult);
    const result = await removeOneEmail(1);
    expect(EmailRepository.delete).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(deleteResult);
  });

  test("updateEmail sould uddate Email by ID", async () => {
    const updateResult = { affected: 1 } as any;
    (EmailRepository.update as jest.Mock).mockResolvedValue(updateResult);
    const result = await updateEmail(1);
    expect(EmailRepository.update).toHaveBeenCalledWith(1, { isRead: true });
    expect(result).toEqual(updateResult);
  });
});