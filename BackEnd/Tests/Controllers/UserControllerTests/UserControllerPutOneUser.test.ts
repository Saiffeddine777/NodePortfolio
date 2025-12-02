import { UpdateResult } from "typeorm";
import { putOneUser } from "../../../Controllers/UserController";
import { User, UserRole } from "../../../Entities/User";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { modifyOneUser } from "../../../Services/UserService";

jest.mock("../../../Services/UserService");
jest.mock("../../../Handlers/ErrorHandlers",()=>({
    errorhandler:jest.fn()
}));

describe ("Testing the success and the failure of the function of postUser", ()=>{
 const mockRequest = ({
    body = {},
    params = {id : 1},
    query = {},
    file = undefined,
  }: {
    body?: any;
    params?:{id :number} ;
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ body, params, query, file } as any);

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };
    const mockUserInput2: Partial<User> = {
      userName: "max_dev",
      email: "max.dev@example.com",
      phoneNumber: "+1234567890",
      occupation: "Fullstack Developer",
      firstName: "Max",
      lastName: "Johnson",
      role: UserRole.VISITOR,
    };
      const mockFileToCloudinary2: Express.Multer.File | undefined = {
    fieldname: "file1",
    originalname: "test-image.png",
    encoding: "7bit",
    mimetype: "image/png",
    buffer: Buffer.from("dummy image data"),
    size: 1234,
    destination: "/uploads",
    filename: "test-image.png",
    path: "/uploads/test1-image.png",
    stream: undefined as any,
  };

     beforeEach(()=>{
        jest.clearAllMocks();
     })


    test("testing the success of postUser should send an one created User" ,async()=>{
        const updateResult = {affected :1}as UpdateResult
        const req = mockRequest({params : {id :1} , body : mockUserInput2 , file:mockFileToCloudinary2});
        const res = mockResponse();
        (modifyOneUser as jest.Mock).mockResolvedValue(updateResult);
        await putOneUser(req, res);
        expect(modifyOneUser).toHaveBeenNthCalledWith(1,1, mockUserInput2 , mockFileToCloudinary2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User has been modified" })

    })

    test("testing the failure of postUser should send an error" ,async()=>{
        const req = mockRequest();
        const res = mockResponse();
        const error: Error = new Error("Some error has happened");
        (modifyOneUser as jest.Mock).mockRejectedValue(error);
        (errorhandler as jest.Mock).mockImplementation();
        await putOneUser(req, res);
        expect(errorhandler).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    })
    
})