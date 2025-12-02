import { updateOneTechnology } from "../../../Controllers/TechnologyController";
import { modifyOneTechnology } from "../../../Services/TechnologyService";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { Technology, TechType } from "../../../Entities/Technology";
import { NullableOrUndefined } from "../../../Types/UtilityTypes";
import { UpdateResult } from "typeorm";
import { MulterRequest } from "../../../Types/ExpressTypes";

jest.mock("../../../Services/TechnologyService");
jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("Testing the success or the failure of updateOneTechnology on the technology entiy controller", () => {
  const data: NullableOrUndefined<Partial<Technology>> = {
    name: "test2",
    technologyType: TechType.INFRASTRUCTURE,
    score: 60,
  };
 const mockRequest = ({
  body = {},
  params = { id: 1 },
  query = {},
  file = undefined,
}: {
  body?: any;
  params?: { id: number };
  query?: any;
  file?: Express.Multer.File;
} = {}): MulterRequest => {
  return {
    body,
    params,
    query,
    file,
  } as MulterRequest;
};
  const mockResponse =()=>{
    const res :any ={};
    res.status= jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
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

  beforeEach(()=>{
    jest.clearAllMocks();
  })

  test("Testing the success updateOneTechnology an it shoudld return a result object ",async () => {
    const updateResult = {affected :1 } as UpdateResult
    const req=  mockRequest({body:data , params:{id:1} , file :mockFileToCloudinary2});
    const res = mockResponse();
    (modifyOneTechnology as jest.Mock).mockResolvedValue(updateResult);
    await updateOneTechnology(req, res);
    expect(modifyOneTechnology).toHaveBeenCalledWith(1, data, mockFileToCloudinary2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updateResult);
  });

  test("testing the failure of updateOneTechnology it should send an error",async () => {
    const req=  mockRequest({body:data , params:{id:1} , file :mockFileToCloudinary2});
    const res = mockResponse();
    const error :Error = new Error("An error has happened");
    (modifyOneTechnology as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await updateOneTechnology(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});

