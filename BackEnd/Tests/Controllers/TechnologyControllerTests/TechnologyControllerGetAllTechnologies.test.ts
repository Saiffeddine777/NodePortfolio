import { getAllTechnologies } from "../../../Controllers/TechnologyController";
import { Technology, TechType } from "../../../Entities/Technology";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { findAllTechnologies } from "../../../Services/TechnologyService";

jest.mock("../../../Services/TechnologyService");
jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("Testing the success and the failure of the getAllTechnologies of the technology Entity Controller", () => {
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
  beforeEach(()=>{
    jest.clearAllMocks()
  })

  test("Testing the success of the getAllTechnologies should return and array of the technologies", async () => {
    const req = mockRequest();
    const res = mockResponse();
    (findAllTechnologies as jest.Mock).mockResolvedValue([mockTechnology]);
    await getAllTechnologies(req,res);
    expect(findAllTechnologies).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([mockTechnology]);
  });

  test("Testing the success of the getAllTechnologies should send ab error", async () => {
    const req  = mockRequest();
    const res = mockResponse();
    const error :Error  = new Error ("Some Error has occured");
    (findAllTechnologies as jest.Mock).mockRejectedValue(error);
    await getAllTechnologies(req,res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
