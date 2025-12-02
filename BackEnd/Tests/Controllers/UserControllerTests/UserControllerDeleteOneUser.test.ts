import { UpdateResult } from "typeorm";
import { deleteOneUser } from "../../../Controllers/UserController";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { removeOneUser } from "../../../Services/UserService";

jest.mock("../../../Services/UserService");
jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("Testing the success and the failure of the function of deleteOneUser should it fail", () => {
  const mockRequest = ({
    body = {},
    params = { id: 1 },
    query = {},
    file = undefined,
  }: {
    body?: any;
    params?: { id: number };
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ body, params, query, file } as any);

  const mockResponse = ()=>{
   const res :any  = {};
   res.status = jest.fn().mockReturnThis();
   res.json = jest.fn().mockReturnThis();
   return res;
  }
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("testing the success of deleteOneUser should send a message", async () => {
    const deleteResult  = {affected :1} as UpdateResult
    const req = mockRequest({params :{id :1}});
    const res = mockResponse();
    (removeOneUser  as jest.Mock).mockResolvedValue(deleteResult);
    await deleteOneUser(req, res);
    expect(removeOneUser).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User has been deleted" });
  });
  test("testing the failure of deleteOneUser should send an error", async () => {
    const req = mockRequest({params :{id :1}});
    const res = mockResponse();
    const error :Error = new Error("Some error has happened");
    (removeOneUser as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await deleteOneUser(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect (res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
