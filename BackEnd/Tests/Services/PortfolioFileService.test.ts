import {
  findOnePortfolioFile,
  createAPortfolioFile,
  findCVportfolioFiles,
  findAllPortfolioFiles,
  removeAPortfolioFileWithName,
  removeOnePortfolioFile,
} from "../../Services/PortfolioFileService";
import {
  uploadToCLoudinary,
  deleteFromCloudinary,
} from "../../Adapters/CloudinaryAdapter";
import { PortfolioFileRepository } from "../../Repositories/PortfolioFileRepository";
import { PortfolioFile } from "../../Entities/PortfolioFile";
import { In } from "typeorm";

jest.mock("../../Repositories/PortfolioFileRepository", () => ({
  __esModule: true,
  PortfolioFileRepository: {
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("../../Adapters/CloudinaryAdapter", () => ({
  uploadToCLoudinary: jest.fn().mockResolvedValue({
    url: "https//cloudserviceexmaple.com",
    public_id: "IDexample",
  }),
  deleteFromCloudinary: jest.fn().mockResolvedValue({
    message: "Example message",
    http_code: 200,
  }),
}));

describe("Portfolio files services test", () => {
  const mockFileToCloudinary: Express.Multer.File | undefined = {
    fieldname: "file",
    originalname: "test-file.pdf",
    encoding: "7bit",
    mimetype: "application/pdf",
    buffer: Buffer.from("dummy file data"),
    size: 1234,
    destination: "/uploads",
    filename: "test-file.pdf",
    path: "/uploads/test-file.pdf",
    stream: undefined as any,
  };

  const mockFileInput: Partial<PortfolioFile> = {
    fileName: "test technology",
  };

  const inputInsertedToDataBase: Partial<PortfolioFile> = {
    publicId: "IDexample",
    publicUrl: "https//cloudserviceexmaple.com",
    fileName: "test technology",
  };

  const portfolioFileInDataBase: Partial<PortfolioFile> = {
    id: 1,
    publicId: "IDexample",
    publicUrl: "https//cloudserviceexmaple.com",
    fileName: "test technology",
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const cvPortfolioFiles: PortfolioFile[] = [
    {
      id: 1,
      publicId: "IDexample",
      publicUrl: "https//cloudserviceexmaple.com",
      fileName: "fullStoryCV",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: 1,
      publicId: "IDexample",
      publicUrl: "https//cloudserviceexmaple.com",
      fileName: "fullStoryCV",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  ];

  test("createAPortfolioFile given a file and fileName this should insert a file to the cloud and put refece in the database", async () => {
    (PortfolioFileRepository.create as jest.Mock).mockReturnValue(
      portfolioFileInDataBase
    );
    (PortfolioFileRepository.save as jest.Mock).mockResolvedValue(
      portfolioFileInDataBase
    );
    const result = await createAPortfolioFile(
      mockFileInput,
      mockFileToCloudinary
    );
    expect(uploadToCLoudinary).toHaveBeenCalledWith(mockFileToCloudinary);
    expect(PortfolioFileRepository.create).toHaveBeenCalledWith(
      inputInsertedToDataBase
    );
    expect(result).toEqual(portfolioFileInDataBase);
  });

  test("findOnePortfolioFile should find the one protforlio file using the iD", async () => {
    (PortfolioFileRepository.findOneBy as jest.Mock).mockResolvedValue(
      portfolioFileInDataBase
    );
    const result = await findOnePortfolioFile(1);
    expect(PortfolioFileRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(portfolioFileInDataBase);
  });

  test("findOnePortfolioFile should find the one protforlio file using the iD", async () => {
    (PortfolioFileRepository.findOneBy as jest.Mock).mockResolvedValue(
      portfolioFileInDataBase
    );
    const result = await findOnePortfolioFile(1);
    expect(PortfolioFileRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(portfolioFileInDataBase);
  });

  test("findAllPortfolioFiles should find all the proftolio files", async () => {
    (PortfolioFileRepository.find as jest.Mock).mockResolvedValue([
      portfolioFileInDataBase,
    ]);
    const result = await findAllPortfolioFiles();
    expect(PortfolioFileRepository.find).toHaveBeenCalled();
    expect(result).toEqual([portfolioFileInDataBase]);
  });

  test("removeOnePortfolioFile should delete the one protforlio file using the iD", async () => {
    const deleteResult = {
      affected: 1,
    };
    (PortfolioFileRepository.findOneBy as jest.Mock).mockResolvedValue(
      portfolioFileInDataBase
    );
    (PortfolioFileRepository.delete as jest.Mock).mockResolvedValue(
      deleteResult
    );
    const result = await removeOnePortfolioFile(1);
    expect(PortfolioFileRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(deleteFromCloudinary).toHaveBeenCalledWith(
      portfolioFileInDataBase.publicId
    );
    expect(result).toEqual(deleteResult);
  });

  test("findCVportfolioFiles should find the CV files when given their name", async () => {
    const params: string[] = ["fullStoryCV", "itCv"];
    (PortfolioFileRepository.find as jest.Mock).mockResolvedValue(
      cvPortfolioFiles
    );
    const result = await findCVportfolioFiles(params);
    expect(PortfolioFileRepository.find).toHaveBeenCalledWith({
      where: {
        fileName: In(params),
      },
    });
    expect(result).toEqual(cvPortfolioFiles);
  });

  test("removeAPortfolioFileWithName should delete the portfoio files when given the name", async () => {
    const deleteResult = {
      affected: 1,
    };
    (PortfolioFileRepository.findOneBy as jest.Mock).mockResolvedValue(portfolioFileInDataBase);
    (PortfolioFileRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

    const result = await removeAPortfolioFileWithName("fullStoryCV");
    expect(PortfolioFileRepository.findOneBy).toHaveBeenCalledWith({ fileName: "fullStoryCV" });
    expect(deleteFromCloudinary).toHaveBeenCalledWith(portfolioFileInDataBase.publicId);
    expect(PortfolioFileRepository.delete).toHaveBeenCalledWith({ fileName: "fullStoryCV" });
    expect(result).toEqual(deleteResult);
    
  });
});
