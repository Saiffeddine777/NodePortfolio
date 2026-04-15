  jest.mock("../../Middlewares/VerifyAdmin", () => ({
    isAdmin: jest.fn((req: any, res: any, next: any) => next()),
    isValid: jest.fn((req: any, res: any, next: any) => next()),
  }));




  jest.mock("../../Handlers/UploadImageHandler", () => {
    return (req: any, res: any, next: any) => next();
  });

  jest.mock("../../Middlewares/RecaptchaVerification", ()=>({
    __esModule : true,
    verifyRecaptcha : jest.fn((req: any, res: any, next: any) => next()),
  }))


  jest.mock("../../Controllers/UserController", () => ({
    deleteOneUser: jest.fn(),
    getAllUsers: jest.fn(),
    getOneUser: jest.fn(),
    logIn: jest.fn(),
    logInWithTokenController: jest.fn(),
    logout: jest.fn(),
    postUser: jest.fn(),
    register: jest.fn(),
    putOneUser: jest.fn(),
    changePassword: jest.fn(),       
  userChangePassword: jest.fn()     
  }));

  import { isAdmin, isValid } from "../../Middlewares/VerifyAdmin";
  import * as UserController from "../../Controllers/UserController";
  import request from "supertest";
  import testApp  from "../test-server";
  import { User, UserRole } from "../../Entities/User";
  import { verifyRecaptcha } from "../../Middlewares/RecaptchaVerification";




  describe("UserRouter Tests", () => {
    const mockUserInput: Partial<User> = {
      userName: "luna_code",
      email: "luna.code@example.com",
      phoneNumber: "+1987654321",
      occupation: "Backend Engineer",
      firstName: "Luna",
      lastName: "Morales",
      role: UserRole.ADMIN,
    };

    const mockUserInputWithPassword: Partial<User> = {
      userName: "luna_code",
      email: "luna.code@example.com",
      phoneNumber: "+1987654321",
      occupation: "Backend Engineer",
      firstName: "Luna",
      lastName: "Morales",
      role: UserRole.ADMIN,
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

    it("POST /api/users should create one user when parital data", async () => {
      (isAdmin as jest.Mock).mockImplementation(
        (req: any, res: any, next: any) => {
          next();
        }
      );
      jest
        .spyOn(UserController, "postUser")
        .mockImplementation(async (req, res) => {
          res.status(201).json(mockUser);
        });
      const res = await request(testApp).post("/api/users/").send(mockUserInput);
      expect(res.status).toBe(201);
      const normalizeBody = {
        ...res.body,
        createdAt: new Date(res.body.createdAt),
        updatedAt: new Date(res.body.updatedAt),
      };
      expect(normalizeBody).toEqual(mockUser);
    });

    it("POST /api/users/register should register one user when given data", async () => {
      (verifyRecaptcha as jest.Mock).mockImplementation((req: any, res: any, next: any) =>
        next()
      );
      jest
        .spyOn(UserController, "register")
        .mockImplementation(async (req, res) => {
          res.status(201).json(mockUser);
        });
      const res = await request(testApp)
        .post("/api/users/register")
        .send(mockUserInputWithPassword);
      expect(res.status).toBe(201);
      const normalizeBody = {
        ...res.body,
        createdAt: new Date(res.body.createdAt),
        updatedAt: new Date(res.body.updatedAt),
      };
      expect(normalizeBody).toEqual(mockUser);
    });

    it("POST /api/users/login should login user when given emaila and password", async () => {
      (verifyRecaptcha as jest.Mock).mockImplementation((req: any, res: any, next: any) =>
        next()
      );
      jest.spyOn(UserController, "logIn").mockImplementation(async (req, res) => {
        res.status(200).json({user :mockUser , accessToken :"token_string"});
      });
      const res = await request(testApp)
        .post("/api/users/login")
        .send({ email: "luna.code@example.com", password: "password12" });
      expect(res.status).toBe(200);
      const normalizeBody = {
        ...res.body,
        user: {
          ...res.body.user,
          createdAt: new Date(res.body.user.createdAt),
          updatedAt: new Date(res.body.user.updatedAt),
        },
      };
      expect(normalizeBody).toEqual({user :mockUser , accessToken :"token_string"});
    });

      it("GET /api/users/token should login user when reciving token", async () => {
      jest.spyOn(UserController, "logInWithTokenController").mockImplementation(async (req, res) => {
        res.status(200).json(mockUser );
      });
      const res = await request(testApp)
        .get("/api/users/token")
      expect(res.status).toBe(200);
      const normalizeBody = {
          ...res.body,
          createdAt: new Date(res.body.createdAt),
          updatedAt: new Date(res.body.updatedAt)
      };
      expect(normalizeBody).toEqual(mockUser);
    });

    it("PUT /api/users/1 should update one user when given partial data", async () => {
      (isAdmin as jest.Mock).mockImplementation(
        (req: any, res: any, next: any) => {
          next();
        }
      );
      jest
        .spyOn(UserController, "putOneUser")
        .mockImplementation(async (req, res) => {
          res.status(200).json({ message: "User has been modified" });
        });
      const res = await request(testApp)
        .put("/api/users/1")
        .send({ userName: "luna_code's tests" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "User has been modified" });
    });

    it("DELETE /api/users/number should delete one user when given the ID", async () => {
      const deleteResult = { message: "User has been deleted" };
      (isAdmin as jest.Mock).mockImplementation(
        (req: any, res: any, next: any) => {
          next();
        }
      );
      jest
        .spyOn(UserController, "deleteOneUser")
        .mockImplementation(async (req, res) => {
          res.status(200).json(deleteResult);
        });
      const res = await request(testApp).delete("/api/users/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(deleteResult);
    });

    it("GET /api/users/number should delete one user when given the ID", async () => {
      (isAdmin as jest.Mock).mockImplementation(
        (req: any, res: any, next: any) => {
          next();
        }
      );
      jest
        .spyOn(UserController, "getOneUser")
        .mockImplementation(async (req, res) => {
          res.status(200).json(mockUser);
        });
      const res = await request(testApp).get("/api/users/1");

      expect(res.status).toBe(200);
      const normalizedBody = {
        ...res.body,
        createdAt: new Date(res.body.createdAt),
        updatedAt: new Date(res.body.updatedAt),
      };
      expect(normalizedBody).toEqual(mockUser);
    });

    it("GET /api/users/ should get all users", async () => {
      (isAdmin as jest.Mock).mockImplementation(
        (req: any, res: any, next: any) => {
          next();
        }
      );
      jest
        .spyOn(UserController, "getAllUsers")
        .mockImplementation(async (req, res) => {
          res.status(200).json([mockUser]);
        });
      const res = await request(testApp).get("/api/users/");
      expect(res.status).toBe(200);
      const normalizeBody = res.body.map((user: User) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }));
      expect(normalizeBody).toEqual([mockUser]);
    });
  });
