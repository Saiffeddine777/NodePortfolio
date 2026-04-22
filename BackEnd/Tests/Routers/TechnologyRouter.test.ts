





jest.mock("../../Middlewares/VerifyAdmin", () => ({
  isAdmin: jest.fn((req: any, res: any, next: any) => next()),
  isValid: jest.fn((req: any, res: any, next: any) => next()),
}));

jest.mock("../../Handlers/UploadImageHandler", () => {
  return (req: any, res: any, next: any) => next();
});


jest.mock("../../Controllers/TechnologyController", () => ({
  deleteOneTechnology: jest.fn(),
  getAllTechnologies: jest.fn(),
  getOneTechnology: jest.fn(),
  postATechnology: jest.fn(),
  getTechnolgiesByTechType: jest.fn(),
  updateOneTechnology: jest.fn(),
  getTechnologiesWithPagination :jest.fn()
}));
import request from "supertest";
import * as TechnologyController from "../../Controllers/TechnologyController";
import  testApp  from "../test-server";
import { isAdmin } from "../../Middlewares/VerifyAdmin";
import { DeleteResult, UpdateResult } from "typeorm";
import { Technology, TechType } from "../../Entities/Technology";



describe("TechnologyRouter tests", () => {
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

  const mockTechnologyInput: Partial<Technology> = {
    name: "test technology",
    technologyType: TechType.TOOLS,
    score: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/technologies/ shoud create a one technologie when given data", async () => {
    (isAdmin as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        next();
      }
    );
    jest
      .spyOn(TechnologyController, "postATechnology")
      .mockImplementation(async (req, res) => {
        res.status(200).json(mockTechnology);
      });
    const res = await request(testApp).post("/api/technologies/").send(mockTechnologyInput);
    expect(res.status).toBe(200);
    const replacementBody = {
      ...res.body,
      createdAt: new Date(res.body.createdAt),
      updatedAt: new Date(res.body.updatedAt),
    };
    expect(replacementBody).toEqual(mockTechnology);
  });


  it("PUT /api/technologies/numnber shoud update a one technologie when given Partial data",async()=>{
    const updateResult = {affected:1 } as UpdateResult;
    (isAdmin  as jest.Mock).mockImplementation((req:any , res:any , next :any)=>{
      next();
    });
    jest.spyOn(TechnologyController ,"updateOneTechnology").mockImplementation(async (req,res)=>{
      res.status(200).json(updateResult)
    });
    const res = await request(testApp).put("/api/technologies/1").send({name: "update test technology"});
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updateResult); 
  });


  it("DELETE /api/technologies/number shoud delete a one technologie when given Id", async () => {
    const deleteResult = { affected: 1 } as DeleteResult;
    (isAdmin as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        next();
      }
    );
    jest
      .spyOn(TechnologyController, "deleteOneTechnology")
      .mockImplementation(async (req, res) => {
        res.status(200).json(deleteResult);
      });
    const res = await request(testApp).delete("/api/technologies/number");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(deleteResult);
  });

  it("GET /api/technologies/number shoud get a one technologie when given Id", async () => {
    jest
      .spyOn(TechnologyController, "getOneTechnology")
      .mockImplementation(async (req, res) => {
        res.status(200).json(mockTechnology);
      });
    const res = await request(testApp).get("/api/technologies/1");
    expect(res.status).toBe(200);
    const replacementBody = {
      ...res.body,
      createdAt: new Date(res.body.createdAt),
      updatedAt: new Date(res.body.updatedAt),
    };

    expect(replacementBody).toEqual(mockTechnology);
  });

  it("GET /api/technologies/ shoud all technologies when called", async () => {
    jest
      .spyOn(TechnologyController, "getAllTechnologies")
      .mockImplementation(async (req, res) => {
        res.status(200).json([mockTechnology]);
      });
    const res = await request(testApp).get("/api/technologies/");
    expect(res.status).toBe(200);
    const replacementBody = res.body.map((tech: Technology) => ({
      ...tech,
      createdAt: new Date(tech.createdAt),
      updatedAt: new Date(tech.updatedAt),
    }));

    expect(replacementBody).toEqual([mockTechnology]);
  });
});
