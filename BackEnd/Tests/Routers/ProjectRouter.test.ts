

jest.mock("../../Middlewares/VerifyAdmin", () => ({
  __esModule: true,
  isAdmin: jest.fn((req: any, res: any, next: any) => next()),
}));

jest.mock ("../../Handlers/UploadImageHandler" ,()=>{
  return (req:any , res:any ,next:any)=>next()
});
jest.mock("../../Controllers/ProjectController", () => ({
  deleteOneProject: jest.fn(),
  getAllProjects: jest.fn(),
  getOneProject: jest.fn(),
  postOneProject: jest.fn(),
  putOneProject: jest.fn(),
}));

import testApp from "../test-server";
import request, { Response } from "supertest";
import * as ProjectController from "../../Controllers/ProjectController";
import Project, { ProjectCategory } from "../../Entities/Project";
import { DeleteResult, UpdateResult } from "typeorm";
import { isAdmin } from "../../Middlewares/VerifyAdmin";


describe("Projects Tests", () => {

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

  beforeEach(() => {
    jest.clearAllMocks();
  });
    it ("PUT /api/projects should create a the project" ,async  ()=>{
    const updateResult ={affected:1 } as UpdateResult;
    (isAdmin as jest.Mock).mockImplementation((req:any , res:any , next:any)=>{
      next()
    });
    jest.spyOn(ProjectController  ,"putOneProject").mockImplementation(async(req ,res)=>{
      res.status(200).json(updateResult);
    });

    const res = await request(testApp).put("/api/projects/1").send({projectName:"test update A project"});
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updateResult)
  });
  
  it("POST /api/projects should create a the project" ,async  ()=>{
    (isAdmin as jest.Mock).mockImplementation((req:any , res:any , next:any)=>{
      next()
    });
    jest.spyOn(ProjectController  , "postOneProject").mockImplementation(async(req ,res)=>{
      res.status(200).json(mockProject);
    });
    const res = await request(testApp).post("/api/projects/").send(mockProjectInput);
    expect(res.status).toBe(200);
        const normalizeBody = {
      ...res.body,
      createdAt: new Date(res.body.createdAt),
      updatedAt: new Date(res.body.updatedAt),
    };
    expect(normalizeBody).toEqual(mockProject  )
  });

    it("PUT /api/projects/1 should update a the project when given ID and data" ,async  ()=>{
      const updateResult = {affected :1} as UpdateResult;
    (isAdmin as jest.Mock).mockImplementation((req:any , res:any , next:any)=>{
      next()
    });
    jest.spyOn(ProjectController  , "putOneProject").mockImplementation(async(req ,res)=>{
      res.status(200).json(updateResult);
    });

    const res = await request(testApp).put("/api/projects/1").send({projectName : "test2"});
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updateResult);
  });


  it("GET /api/projects should return all the projects", async () => {
    jest
      .spyOn(ProjectController, "getAllProjects")
      .mockImplementation(async (req, res) => {
        res.status(200).json([mockProject]);
      });
    const res: Response = await request(testApp).get("/api/projects");
    expect(res.status).toBe(200);
    const normalizeBody = res.body.map((project: Project) => {
      return {
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      };
    });
    expect(normalizeBody).toEqual([mockProject]);
  });

  it("GET /api/projects/1 should return one project when given an ID", async () => {
    jest
      .spyOn(ProjectController, "getOneProject")
      .mockImplementation(async (req, res) => {
        res.status(200).json(mockProject);
      });
    const res: Response = await request(testApp).get("/api/projects/1");
    expect(res.status).toBe(200);
    const normalizeBody = {
      ...res.body,
      createdAt: new Date(res.body.createdAt),
      updatedAt: new Date(res.body.updatedAt),
    };
    expect(normalizeBody).toEqual(mockProject);
  });


  it("DELETE /api/projects/1 should delete one project when given an ID", async () => {
    const result = { affected: 1 } as DeleteResult;
    (isAdmin as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        next();
      }
    );
    jest
      .spyOn(ProjectController, "deleteOneProject")
      .mockImplementation(async (req, res) => {
        res
          .status(200)
          .json({ message: "The Project has been deleted", ...result });
      });
    const res: Response = await request(testApp).delete("/api/projects/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "The Project has been deleted", ...result });
  });
});
