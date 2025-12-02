import { getOneProject , } from "../../../Controllers/ProjectController";
import Project, { ProjectCategory } from "../../../Entities/Project";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { findOneProject } from "../../../Services/ProjectService";

jest.mock("../../../Services/ProjectService");

jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("Testing the success or the failure of the getOneProject of the Project Entituy Controller", () => {
  
    const mockRequest = ({body ={} , params ={ id : 1} , query ={}} :{body?:any, params?:{id :number} ,query?:any }={} ) =>({body , params ,query} as any); 
    const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res
  };



  const mockProject: Project = {
    id: 1,
    projectName: "Portfolio Website",
    githubUrl: "https://github.com/luna-code/portfolio",
    liveUrl: "https://luna-portfolio.dev",
    published: true,
    description:
      "A personal portfolio website showcasing my projects, skills, and contact information.",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1690000000/portfolio.png",
    publicId: "portfolio_image_123",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    category: ProjectCategory.WEB,
    createdAt: new Date("2024-01-10T12:00:00Z"),
    updatedAt: new Date("2024-01-15T12:00:00Z"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("testing the success of the function it should send a project entity", async () => {
    const req = mockRequest({params:{id:1}});
    const res = mockResponse();
    (findOneProject as jest.Mock).mockResolvedValue(mockProject);
    await getOneProject(req, res);
    expect(findOneProject).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProject);


  });
  test("testing the failure of the function it should send an error", async () => {
    const req = mockRequest();
    const res  =  mockResponse();
    const error :Error = new Error ("Some error has occured");
    (findOneProject as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await getOneProject(req,res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
