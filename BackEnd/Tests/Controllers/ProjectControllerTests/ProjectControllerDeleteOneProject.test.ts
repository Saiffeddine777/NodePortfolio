import { DeleteResult } from "typeorm";
import { deleteOneProject  } from "../../../Controllers/ProjectController";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { removeOneProject } from "../../../Services/ProjectService";

jest.mock("../../../Services/ProjectService");
jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("Testing the ssuccess or failure deleteOneProject of the project entity controller ", () => {
  const mockRequest = ({body ={} , params ={id :1} , query={} } : {body?:any , params?:{id:number} , query?:any} ={})=>({body , params , query}as any);
  const mockResponse =()=>{
    const res :any ={};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res ;
  };
  beforeEach(()=>{
    jest.clearAllMocks();
  })
  
  test("Testing the success of the function deleteOneProject should send an object", async () => {
    const deleteResult ={affected: 1} as DeleteResult
    const result  = { message: "The Project has been deleted", ...deleteResult}
    const req = mockRequest ({params:{id :1}});
    const res = mockResponse();
    (removeOneProject  as jest.Mock).mockResolvedValue(result);
    await deleteOneProject(req, res);
    expect(removeOneProject).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(result);

  });
  test("testing the failure of the deleteOneProject should return an error", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error :Error = new Error ("Some error has occured");
    (removeOneProject as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await deleteOneProject(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
