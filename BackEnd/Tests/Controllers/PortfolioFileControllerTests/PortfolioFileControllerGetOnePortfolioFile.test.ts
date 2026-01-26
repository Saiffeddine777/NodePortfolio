import { getOnePortfolioFile } from "../../../Controllers/PortfolioFileController";
import { PortfolioFile } from "../../../Entities/PortfolioFile";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { findOnePortfolioFile } from "../../../Services/PortfolioFileService";

jest.mock("../../../Services/PortfolioFileService");

jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("getOnePortfolioFile should get the entity of the Portfolio file wehen given an ID", () => {
  const portfolioFileInDataBase: Partial<PortfolioFile> = {
    id: 1,
    publicId: "IDexample",
    publicUrl: "https//cloudserviceexmaple.com",
    fileName: "test technology",
    createdAt: new Date("2024-01-10T12:00:00Z"),
    updatedAt: new Date("2024-01-15T12:00:00Z"),
  };

  const mockRequest = ({
    params = { id: 1 },
    body = {},
    query = {},
    file = undefined,
  }: {
    params?: { id: number };
    body?: Partial<PortfolioFile>;
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ params, body, query, file } as any);
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  test("getOnePortfolioFile when successful should send the entity ", async () => {
    const req = mockRequest({ params: { id: 1 } });
    const res = mockResponse();
    (findOnePortfolioFile as jest.Mock).mockResolvedValue(
      portfolioFileInDataBase
    );
    await getOnePortfolioFile(req, res);
    expect(findOnePortfolioFile).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(portfolioFileInDataBase);
  });

  test("getOnePortfolioFile when failed should send and log the error ", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error: Error = new Error("An Error has occured");
    (findOnePortfolioFile as jest.Mock).mockRejectedValue(
      error
    );
    (errorhandler as jest.Mock).mockImplementation();
    await getOnePortfolioFile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});


