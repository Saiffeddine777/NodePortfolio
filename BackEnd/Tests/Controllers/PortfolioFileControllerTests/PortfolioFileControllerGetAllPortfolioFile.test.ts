import { getAllPortfolioFile } from "../../../Controllers/PortfolioFileController";
import { PortfolioFile } from "../../../Entities/PortfolioFile";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { findAllPortfolioFiles } from "../../../Services/PortfolioFileService";

jest.mock("../../../Services/PortfolioFileService");

jest.mock("../../../Handlers/ErrorHandlers" , ()=>({
    errorhandler : jest.fn()
}))

describe("getAllPortfolioFile should send all the entities of PortfolioFile", () => {
  
   const portfolioFileInDataBase: Partial<PortfolioFile> = {
       id: 1,
       publicId: "IDexample",
       publicUrl: "https//cloudserviceexmaple.com",
       fileName: "test technology",
       createdAt: new Date("2024-01-10T12:00:00Z"),
       updatedAt: new Date("2024-01-15T12:00:00Z"),
     };
  
    const mockRequest = ({
    params = {},
    body = {},
    query = {},
    file = undefined,
  }: {
    params?: any;
    body?: any;
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ params, body, query, file } as any);

  const mockResponse = ()=>{
    const res :any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res; 
  }
  test("getAllPortfolioFile if successfull should send all the entities of PortfolioFile", async () => {
    const req = mockRequest();
    const res = mockResponse();
    (findAllPortfolioFiles as jest.Mock).mockResolvedValue([portfolioFileInDataBase]);
    await getAllPortfolioFile(req, res);
    expect(findAllPortfolioFiles).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([portfolioFileInDataBase]);

  });

  test("getAllPortfolioFile if successfull should send all the entities of PortfolioFile", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error :Error = new Error ("An unexpected error has occured");
    (findAllPortfolioFiles as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await getAllPortfolioFile(req, res);
    expect(errorhandler).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});

