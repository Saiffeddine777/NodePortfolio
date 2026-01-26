import { postAPortfolioFile } from "../../../Controllers/PortfolioFileController";
import { PortfolioFile } from "../../../Entities/PortfolioFile";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { createAPortfolioFile } from "../../../Services/PortfolioFileService";

jest.mock("../../../Services/PortfolioFileService");

jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));


describe("postAPortfolioFile must retuen a created file entiy wehen given patial data and a file", () => {
  const mockFileInput: Partial<PortfolioFile> = {
    fileName: "test technology",
  };

  const mockFileToCloudinary: Express.Multer.File | undefined = {
    fieldname: "file",
    originalname: "test-file.pdf",
    encoding: "7bit",
    mimetype: "application/pdf",
    buffer: Buffer.from("dummy file data"),
    size: 1234,
    destination: "/uploads",
    filename: "test-file.pdf",
    path: "/uploads/test-file.pdf",
    stream: undefined as any,
  };

  const portfolioFileInDataBase: Partial<PortfolioFile> = {
    id: 1,
    publicId: "IDexample",
    publicUrl: "https//cloudserviceexmaple.com",
    fileName: "test technology",
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const mockRequest = ({
    params = { id: 1 },
    body = {},
    query = {},
    file = undefined,
  }: {
    params?: { id: number };
    body?: Partial<PortfolioFile>;
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ params, body, query, file } as any);

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("testing the success of the fuction as the success should retun the disered entity", async () => {
    const req = mockRequest({body : {...mockFileInput} , file :{...mockFileToCloudinary}});
    const res  = mockResponse();
    (createAPortfolioFile as jest.Mock).mockResolvedValue(portfolioFileInDataBase);
    await postAPortfolioFile (req, res);
    expect(createAPortfolioFile).toHaveBeenCalledWith(req.body ,req.file);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(portfolioFileInDataBase);
  });

  test("testing the failure as it should return the error", async () => {
    const req = mockRequest({body : {...mockFileInput} , file :{...mockFileToCloudinary}});
    const res  = mockResponse();
    const error : Error = new Error ("Some errror has occured");
    (createAPortfolioFile as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await postAPortfolioFile(req,res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
