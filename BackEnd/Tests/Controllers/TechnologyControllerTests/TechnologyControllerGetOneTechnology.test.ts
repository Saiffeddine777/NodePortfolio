import { getOneTechnology  } from "../../../Controllers/TechnologyController";
import { findOneTechnology } from "../../../Services/TechnologyService";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { Technology, TechType } from "../../../Entities/Technology";
jest.mock("../../../Services/TechnologyService");
jest.mock("../../../Handlers/ErrorHandlers" , ()=>({
    errorhandler: jest.fn()
}))


describe("Testing the success and the a failure of getOneTechnology of the technoloy entity", ()=>{
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
    params = {id:1},
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

    test("Testing the success of getOneTechnology shoudld send one project",async ()=>{
        const req = mockRequest({params:{id : 1}})
        const res = mockResponse();
        (findOneTechnology as jest.Mock).mockResolvedValue(mockTechnology)
        await getOneTechnology(req,res);
        expect(findOneTechnology).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockTechnology);
      

    })  
    test("Testing the failure of getOneTechnology shoudld send and error", async()=>{
            const req  = mockRequest();
            const res = mockResponse();
            const error :Error  = new Error ("Some Error has occured");
            (findOneTechnology as jest.Mock).mockRejectedValue(error);
            await getOneTechnology(req,res);
            expect(errorhandler).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
    })   
})