jest.mock("../../Middlewares/VerifyAdmin", () => ({
  __esModule: true,
  isAdmin: jest.fn((req: any, res: any, next: any) => next()),
  isValid: jest.fn((req: any, res: any, next: any) => next()),
}));

jest.mock("../../Handlers/UploadImageHandler", () => {
  return (req: any, res: any, next: any) => next();
});

jest.mock("../../Controllers/PortfolioFileController", () => ({
  deleteOnePorfolioFile: jest.fn(),
  deleteOnePorfolioFileWithName: jest.fn(),
  getAllPortfolioFile: jest.fn(),
  getCVPortfolioFile: jest.fn(),
  getOnePortfolioFile: jest.fn(),
  postAPortfolioFile: jest.fn(),
}));

import * as PortfolioFilesController from "../../Controllers/PortfolioFileController";
import request, { Response } from "supertest";
import testApp from "../test-server";
import { PortfolioFile } from "../../Entities/PortfolioFile";
import { isAdmin } from "../../Middlewares/VerifyAdmin";
import { DeleteResult } from "typeorm";

const portfolioFileInDataBase: Partial<PortfolioFile> = {
  id: 1,
  publicId: "IDexample",
  publicUrl: "https//cloudserviceexmaple.com",
  fileName: "test technology",
  createdAt: new Date("2024-01-10T12:00:00Z"),
  updatedAt: new Date("2024-01-15T12:00:00Z"),
};

const portfolioFileCVs: Partial<PortfolioFile>[] = [{
  id: 1,
  publicId: "fullStoryCV",
  publicUrl: "https//cloudserviceexmaple.com",
  fileName: "test technology",
  createdAt: new Date("2024-01-10T12:00:00Z"),
  updatedAt: new Date("2024-01-15T12:00:00Z"),
},
{
  id: 2,
  publicId: "itCv",
  publicUrl: "https//cloudserviceexmaple.com",
  fileName: "test technology",
  createdAt: new Date("2024-01-10T12:00:00Z"),
  updatedAt: new Date("2024-01-15T12:00:00Z"),
}
];

describe("Portforlio files tests", () => {
  
  
  it("POST /api/files/ should create and send the portfoliofile enity to the Client side", async () => {
    (isAdmin as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        next();
      }
    );
    jest
      .spyOn(PortfolioFilesController, "postAPortfolioFile")
      .mockImplementation(async (req, res) => {
        res.status(201).json(portfolioFileInDataBase);
      });
    const response: Response = await request(testApp).post("/api/files/").send({fileName: "test technology"});
    expect(response.status).toBe(201);
    const normalizeBody = {
      ...response.body,
      createdAt: new Date(response.body.createdAt),
      updatedAt: new Date(response.body.updatedAt),
    };
    expect(normalizeBody).toEqual(portfolioFileInDataBase);
  });


  it("GET /api/files/ should send all the elements of the portfoliofile entity array to the Client side", async () => {
    jest
      .spyOn(PortfolioFilesController, "getAllPortfolioFile")
      .mockImplementation(async (req, res) => {
        res.status(200).json([portfolioFileInDataBase]);
      });
    const response: Response = await request(testApp).get("/api/files/");
    expect(response.status).toBe(200);
    const normalizeBody = response.body.map((file:PortfolioFile)=>{
      return{
      ...file,
      createdAt: new Date(file.createdAt),
      updatedAt: new Date(file.updatedAt),
    };
    })
    expect(normalizeBody).toEqual([portfolioFileInDataBase]);
  });

    it("GET /api/files/1 should send  the portfoliofile entity witht the ID of 1", async () => {
    jest
      .spyOn(PortfolioFilesController, "getOnePortfolioFile")
      .mockImplementation(async (req, res) => {
        res.status(200).json(portfolioFileInDataBase);
      });
    const response: Response = await request(testApp).get("/api/files/1");
    expect(response.status).toBe(200);
    const normalizeBody = {
      ...response.body,
      createdAt: new Date(response.body.createdAt),
      updatedAt: new Date(response.body.updatedAt),
    };
    expect(normalizeBody).toEqual(portfolioFileInDataBase);
  });

  
  it("GET /api/files/cvs/fullStoryCV/itCv should send  the portfoliofile entities relative to the CV", async () => {
    jest
      .spyOn(PortfolioFilesController, "getCVPortfolioFile")
      .mockImplementation(async (req, res) => {
        res.status(200).json(portfolioFileCVs);
      });
    const response: Response = await request(testApp).get("/api/files/cvs/fullStoryCV/itCv");
    expect(response.status).toBe(200);
    const normalizeBody = response.body.map((file:PortfolioFile)=>{
      return{
      ...file,
      createdAt: new Date(file.createdAt),
      updatedAt: new Date(file.updatedAt),
    };
    })
    expect(normalizeBody).toEqual(portfolioFileCVs);
  });

  it("DELETE /api/files/1 should delete the portfoliofile entity  when given the ID", async () => {
    (isAdmin as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        next();
      }
    );
    jest
      .spyOn(PortfolioFilesController,"deleteOnePorfolioFile")
      .mockImplementation(async (req, res) => {
        res.status(200).json({affected:1}as DeleteResult);
      });
    const response: Response = await request(testApp).delete("/api/files/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({affected:1});
  });

  it("DELETE /api/files/delete/fullStoryCV should delete the portfoliofile entity when given the name", async () => {
    (isAdmin as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        next();
      }
    );
    jest
      .spyOn(PortfolioFilesController,"deleteOnePorfolioFileWithName")
      .mockImplementation(async (req, res) => {
        res.status(200).json({affected:1}as DeleteResult);
      });
    const response: Response = await request(testApp).delete("/api/files/delete/fullStoryCV");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({affected:1});
  });


});
