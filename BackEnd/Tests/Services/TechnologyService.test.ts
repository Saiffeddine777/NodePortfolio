import {
  createATechnologie,
  findAllTechnologies,
  findOneTechnology,
  removeOneTechnology,
  modifyOneTechnology,
} from "../../Services/TechnologyService";
import { Technology, TechType } from "../../Entities/Technology";
import { TechnologyRepository } from "../../Repositories/TechnologyRepository";
import { uploadToCLoudinary ,deleteFromCloudinary } from "../../Adapters/CloudinaryAdapter";
import { NullableOrUndefined } from "../../Types/UtilityTypes";

jest.mock("../../Repositories/TechnologyRepository", () => ({
  __esModule: true,
  TechnologyRepository: {
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


describe("TechnologyService test", () => {
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
  const mockTechnologyInput: Partial<Technology> = {
    name: "test technology",
    technologyType: TechType.TOOLS,
    score: 50,
  };

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createATechnologie should Create a Technology instance", async () => {
    (TechnologyRepository.create as jest.Mock).mockReturnValue(mockTechnology);
    (TechnologyRepository.save as jest.Mock).mockResolvedValue(mockTechnology);

    const result = await createATechnologie(
      mockTechnologyInput,
      mockFileToCloudinary
    );

    expect(uploadToCLoudinary).toHaveBeenCalledWith(mockFileToCloudinary);
    expect(TechnologyRepository.create).toHaveBeenCalledWith({
      ...mockTechnologyInput,
      logoUrl: "https//cloudserviceexmaple.com",
      publicId: "IDexample",
    });

    expect(result).toEqual(mockTechnology);
  });

  test("findAllTechnologies should find all the technololgies", async () => {
    (TechnologyRepository.find as jest.Mock).mockResolvedValue([mockTechnology])
    const result = await findAllTechnologies()
    expect(TechnologyRepository.find).toHaveBeenCalled()
    expect(result).toEqual([mockTechnology])

  });

  test("findOneTechnology should find a technology By id", async () => {
    (TechnologyRepository.findOneBy as jest.Mock).mockResolvedValue(mockTechnology)
    const result = await findOneTechnology(1)
    expect(TechnologyRepository.findOneBy).toHaveBeenCalledWith({id:1})
    expect(result?.id).toBe(mockTechnology.id)
    expect(result).toEqual(mockTechnology)
  });


  test("removeOneTechnology should remove the technology and call deleteFromCloudinary if publicId exists", async () => {
    jest
      .spyOn(TechnologyRepository, "findOneBy")
      .mockResolvedValue(mockTechnology);
    jest
      .spyOn(TechnologyRepository, "delete")
      .mockResolvedValue({ affected: 1 } as any);

    const result = await removeOneTechnology(1);

    expect(TechnologyRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(deleteFromCloudinary).toHaveBeenCalledWith(mockTechnology.publicId);
    expect(TechnologyRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });

  test("modifyOneTechnology should modify the technology targeting it with ID" ,async ()=>{
    
    const data :NullableOrUndefined<Partial<Technology>> = {name : "test2" , technologyType : TechType.INFRASTRUCTURE , score :60}
    jest
      .spyOn(TechnologyRepository,"update")
      .mockResolvedValue({affected :1}as any)
    jest
      .spyOn(TechnologyRepository, "findOneBy")
      .mockResolvedValue(mockTechnology)

    const result = await modifyOneTechnology(1, data , mockFileToCloudinary2)
    
    expect(TechnologyRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(deleteFromCloudinary).toHaveBeenCalledWith(mockTechnology.publicId);
    expect(uploadToCLoudinary).toHaveBeenCalledWith(mockFileToCloudinary2)
    expect(TechnologyRepository.update).toHaveBeenCalledWith(1,data)
    expect(result).toEqual({affected:1})
  })

});
