import {
  uploadToCLoudinary,
  deleteFromCloudinary,
} from "../../Adapters/CloudinaryAdapter";
import Project, { ProjectCategory } from "../../Entities/Project";
import { ProjectRepository } from "../../Repositories/ProjectRepository";
import {
  createOneProject,
  findAllProjects,
  findOneProject,
  removeOneProject,
  modifyOneProject,
} from "../../Services/ProjectService";

jest.mock("../../Adapters/CloudinaryAdapter", () => ({
  uploadToCLoudinary: jest.fn().mockResolvedValue({
    url: "https://res.cloudinary.com/demo/image/upload/v1690000000/portfolio.png",
    public_id: "portfolio_image_123",
  }),
  deleteFromCloudinary: jest.fn().mockResolvedValue({
    message: "Example message",
    http_code: 200,
  }),
}));

describe("Testing the Project Service", () => {
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

    const mockFileToCloudinary2: Express.Multer.File | undefined = {
      fieldname: "file1",
      originalname: "test-image.png",
      encoding: "7bit",
      mimetype: "image/png",
      buffer: Buffer.from("dummy image data"),
      size: 1234,
      destination: "/uploads",
      filename: "test-image.png",
      path: "/uploads/test1-image.png",
      stream: undefined as any,
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

  const mockProjectInput: Partial<Project> = {
    projectName: "Portfolio Website",
    githubUrl: "https://github.com/luna-code/portfolio",
    liveUrl: "https://luna-portfolio.dev",
    published: true,
    description:
      "A personal portfolio website showcasing my projects, skills, and contact information.",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    category: ProjectCategory.WEB,
  };

  test("createOneProject must create Project instance", async () => {
    jest.spyOn(ProjectRepository, "create").mockReturnValue(mockProject);
    jest.spyOn(ProjectRepository, "save").mockResolvedValue(mockProject);
    const result = await createOneProject(
      mockProjectInput,
      mockFileToCloudinary
    );
    expect(uploadToCLoudinary).toHaveBeenCalledWith(mockFileToCloudinary);
    expect(ProjectRepository.create).toHaveBeenCalledWith(mockProjectInput);
    expect(ProjectRepository.save).toHaveBeenCalledWith(mockProject);
    expect(result).toEqual(mockProject);
  });

  test("findAllProjects must return a Project array", async () => {
    jest.spyOn(ProjectRepository, "find").mockResolvedValue([mockProject]);
    const result = await findAllProjects();
    expect(ProjectRepository.find).toHaveBeenCalled();
    expect(result).toEqual([mockProject]);
  });

  test("findOneProject must return Project instance after inputing ID", async () => {
    jest.spyOn(ProjectRepository, "findOneBy").mockResolvedValue(mockProject);
    const result = await findOneProject(1);
    expect(ProjectRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockProject);
  });

  test("removeOneProject must remove Project instance after inputing ID", async () => {
    jest.spyOn(ProjectRepository, "findOneBy").mockResolvedValue(mockProject);
    jest
      .spyOn(ProjectRepository, "delete")
      .mockResolvedValue({ affected: 1 } as any);
    const result = await removeOneProject(1);
    expect(ProjectRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(deleteFromCloudinary).toHaveBeenCalledWith(mockProject.publicId);
    expect(ProjectRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });

  test("modifyOneProject must modify Project instance after inputing ID and the data", async () => {
    const data: Partial<Project> = {
      projectName: "Portfolio ",
      githubUrl: "https://github.com/luna-code/test",
      liveUrl: "https://luna-portfolio.test",
      published: true,
      description:
        "A personal portfolio website showcasing my projects, skills, and contact information.",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      category: ProjectCategory.WEB,
    };

    jest
      .spyOn(ProjectRepository, "findOneBy")
      .mockResolvedValue(mockProject);
    jest
      .spyOn(ProjectRepository, "update")
      .mockResolvedValue({ affected: 1 } as any);
    const result = await modifyOneProject(1, data , mockFileToCloudinary2);
    expect(ProjectRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(deleteFromCloudinary).toHaveBeenCalledWith(mockProject.publicId);
    expect(uploadToCLoudinary).toHaveBeenCalledWith(mockFileToCloudinary2);
    expect(ProjectRepository.update).toHaveBeenCalledWith(1,{...data , publicId : "portfolio_image_123" ,imageUrl: "https://res.cloudinary.com/demo/image/upload/v1690000000/portfolio.png"});
    expect(result).toEqual({affected:1})
  });
});
