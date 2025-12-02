import { postATechnology  } from "../../../Controllers/TechnologyController";
import { Technology, TechType } from "../../../Entities/Technology";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { createATechnologie } from "../../../Services/TechnologyService";


jest.mock("../../../Services/TechnologyService");
jest.mock("../../../Handlers/ErrorHandlers" , ()=>({
  errorhandler : jest.fn()
}))

describe("Testing the success and the faitlure of the postATechnology of the technology entity Controller", () => {
  const mockTechnologyInput: Partial<Technology> = {
    name: "test technology",
    technologyType: TechType.TOOLS,
    score: 50,
  };
   const mockTechnology: Technology = {
    id: 1,
    name: "test technology",
    logoUrl: "https//cloudserviceexmaple.com",
    technologyType: TechType.TOOLS,
    score: 50,
    publicId: "IDexample",
    updatedAt: new Date(),
    createdAt: new Date(),
  };
  const mockFileToCloudinary: Express.Multer.File | undefined = {
    fieldname: "file",
    originalname: "test-image.png",
    encoding: "7bit",
    mimetype: "image/png",
    buffer: Buffer.from("dummy image data"),
    size: 1234,
    destination: "/uploads",
    filename: "test-image.png",
    path: "/uploads/test-image.png",
    stream: undefined as any,
  };
  const mockRequest = ({
    body = {},
    params = {},
    query = {},
    file = undefined,
  }: {
    body?: any;
    params?: any;
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ body, params, query, file } as any);
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;  
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("testing the success of the postATechnology as it should send the technology instance", async () => {
    const req = mockRequest({body :mockTechnologyInput , file : mockFileToCloudinary});
    const res = mockResponse();
    (createATechnologie as jest.Mock).mockResolvedValue(mockTechnology);
    await postATechnology(req,res);
    expect(createATechnologie).toHaveBeenCalledWith(mockTechnologyInput , mockFileToCloudinary);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockTechnology);
  });

  test("testing failure the of the postATechnology as it should send an error", async () => {
    const req = mockRequest();
    const res=  mockResponse();
    const error :Error = new Error ("Some error has occured");
    (createATechnologie as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await postATechnology(req,res);
    expect (errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error)
    
  });
});

