import { postOneProject } from "../../../Controllers/ProjectController";
import Project, { ProjectCategory } from "../../../Entities/Project";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { createOneProject } from "../../../Services/ProjectService";

jest.mock("../../../Services/ProjectService");

jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("testing the postOneProject for success and failure", () => {
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

  const mockProjectInput: Partial<Project> = {
    projectName: "Portfolio Website",
    githubUrl: "https://github.com/luna-code/portfolio",
    liveUrl: "https://luna-portfolio.dev",
    published: true,
    description:
      "A personal portfolio website showcasing my projects, skills, and contact information.",
    techStack: "React, TypeScript, Node.js, PostgreSQL" as any,
    category: ProjectCategory.WEB,
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

  const mockRequest = ({
    params = { id: 1 },
    body = {},
    query = {},
    file =undefined
  }: { params?: { id: number }; body?: Partial<Project>; query?: any , file?:Express.Multer.File  } = {}) =>
    ({ params, body, query  ,file} as any);

    const mockResponse = ()=>{
        const res :any ={}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        return res
    }

  test("Testing the success of postOneProject as it should send a project instance", async () => {
    const req  = mockRequest({body :{...mockProjectInput} , file:{...mockFileToCloudinary}});
    const res = mockResponse();
    (createOneProject as jest.Mock).mockResolvedValue(mockProject);
    await postOneProject(req,res);
    expect(createOneProject).toHaveBeenCalledWith( expect.objectContaining({
    techStack: expect.arrayContaining([
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL"
    ])
  }) , mockFileToCloudinary);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockProject)

  });

  test("Testing the failure of th postOneProject as it should send an error and log it on the log files", async () => {
    const res = mockResponse();
    const req = mockRequest();
    const error: Error  = new Error ("Some error happened");
    (errorhandler as jest.Mock).mockImplementation();
    (createOneProject as jest.Mock).mockRejectedValue(error);
    await postOneProject(req,res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect (res.json).toHaveBeenCalledWith(error)
  });

});
