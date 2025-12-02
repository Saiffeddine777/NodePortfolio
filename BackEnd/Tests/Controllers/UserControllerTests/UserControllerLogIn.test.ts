import { logIn } from "../../../Controllers/UserController";
import { User, UserRole } from "../../../Entities/User";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { signInUser } from "../../../Services/UserService";


jest.mock("../../../Services/UserService");
jest.mock("../../../Handlers/ErrorHandlers",()=>({
    errorhandler:jest.fn()
}));

describe ("Testing the success and the failure of the function of logIn", ()=>{

    const mockRequest = ({
        body ={ email:"email@gmail.com", password: "password12"},
        params ={},
        query={},
        file=undefined
    }:{
        body?:{email:string, password :string},
        params? :any,
        query?:any,
        file?:Express.Multer.File
    }={})=>({body , params ,query ,file}as any );

    const mockResponse = ()=>{
        const res :any={};
        res.status =jest.fn().mockReturnThis();
        res.json =jest.fn().mockReturnThis();
        res.cookie = jest.fn().mockReturnThis();
        return res ;
    }
     const mockUser: Partial<User> = {
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
      };

      const resultOfSignIn ={
        user : mockUser,
        refreshToken: "Some token string",
        accessToken: "Some token string"
      }

    beforeEach(()=>{
        jest.clearAllMocks();
    })

    test("testing the success of logIn should send an one User" ,async()=>{
        const req = mockRequest({body :{email:"email@gmail.com", password: "password12"}});
        const res = mockResponse();
        (signInUser as jest.Mock).mockResolvedValue(resultOfSignIn);
        await logIn(req , res);
        expect(res.cookie).toHaveBeenCalledWith("refreshToken",resultOfSignIn?.refreshToken , {
          httpOnly : true,
          secure : false ,
          sameSite :"lax",
          maxAge : 7 * 24 * 60 * 60 * 1000
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({accessToken: resultOfSignIn?.accessToken  ,...resultOfSignIn?.user});
    })

    test("testing the failure of logIn should send an error" ,async()=>{
        const req = mockRequest();
        const res = mockResponse();
        const error :Error = new Error ("Some error has happened");
        (signInUser as jest.Mock).mockRejectedValue(error);
        (errorhandler as jest.Mock).mockImplementation();
        await logIn(req,res);
        expect(errorhandler).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error)
    })
    
})