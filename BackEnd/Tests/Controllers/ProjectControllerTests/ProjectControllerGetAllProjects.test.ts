import { getAllProjects  } from "../../../Controllers/ProjectController";
import { ProjectCategory } from "../../../Entities/Project";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { findAllProjects } from "../../../Services/ProjectService";

jest.mock("../../../Services/ProjectService");

jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("testing the getAllProjects in success or on failure par of the controller of ProjectController", () => {
  const mockProject = {
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
  const mockRequest = ({body ={} , params ={} , query ={}}:{body ?:any , params?:any , query ?:any}={})=>({body  , params  , query }as any)
  const mockResponse = ()=>{
    const res :any ={}
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }

  test("testing the success of the getAllProjects as it should send the array of projects ", async () => {
    const res = mockResponse();
    const req = mockRequest();
    (findAllProjects as jest.Mock).mockResolvedValue([mockProject]);
    await getAllProjects (req,res);
    expect (findAllProjects).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith([mockProject])
  });

  test("testing the failure asn it should log the error in the logs and send it", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error :Error =  new Error ("Some error has happen");
    (findAllProjects as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await getAllProjects(req, res)
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error)
  });
});
