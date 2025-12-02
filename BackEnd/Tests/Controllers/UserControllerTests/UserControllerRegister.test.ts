import { register } from "../../../Controllers/UserController";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { signUpUser } from "../../../Services/UserService";
import { User , UserRole } from "../../../Entities/User";

jest.mock("../../../Services/UserService");
jest.mock("../../../Handlers/ErrorHandlers",()=>({
    errorhandler:jest.fn()
}));

describe ("Testing the success and the failure of the function of register", ()=>{
      const mockUserInputSignUp: Partial<User> = {
        userName: "luna_code",
        email: "luna.code@example.com",
        phoneNumber: "+1987654321",
        occupation: "Backend Engineer",
        firstName: "Luna",
        password: "password12676",
        lastName: "Morales",
        role: UserRole.ADMIN,
      };

      const mockRequest = ({
        body ={} , params ={} , query={} , file =undefined
      } :{
        body?:any, params ?:any, query?:any , file?:Express.Multer.File
      }={})=>({
        body  , params  , query , file
      }as any);

      const mockResponse = ()=>{
        const res :any ={};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        return res;
      };

    beforeEach(()=>{
        jest.clearAllMocks();
    })

    test("testing the success of register should signUp One user" ,async()=>{
        const req = mockRequest({body : mockUserInputSignUp});
        const res = mockResponse();
        (signUpUser as jest.Mock).mockResolvedValue("User has signed up Successfully");
        await register (req,res);
        expect(signUpUser).toHaveBeenCalledWith(mockUserInputSignUp);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith("User has signed up Successfully");
    })

    test("testing the failure of register should send an error" ,async()=>{
        const req = mockRequest();
        const res = mockResponse();
        const error :Error = new Error ("Error has happened");
        (signUpUser as jest.Mock).mockRejectedValue(error);
        (errorhandler as jest.Mock).mockImplementation();
        await register(req, res);
        expect(errorhandler).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    })
    
})