import { DeleteResult } from "typeorm";
import { deleteOnePorfolioFileWithName } from "../../../Controllers/PortfolioFileController";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { removeAPortfolioFileWithName } from "../../../Services/PortfolioFileService";

jest.mock("../../../Services/PortfolioFileService");

jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("deleteOnePorfolioFileWithName shoudl delete the PortfolioFile entity", () => {
  const mockRequest = ({
    params = { fileName: "itCv" },
    body = {},
    query = {},
    file = undefined,
  }: {
    params?: { fileName: string };
    body?: any;
    query?: any;
    file?: Express.Multer.File;
  } = {}) => ({ params, body, query, file } as any);

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

test("In success the function should delete and send the delete result", async () => {
  const deleteResult = { affected: 1 } as DeleteResult;
  const req = mockRequest({ params: { fileName: "itCv" } });
  const res = mockResponse();

  (removeAPortfolioFileWithName as jest.Mock)
    .mockResolvedValue(deleteResult);

  await deleteOnePorfolioFileWithName(req, res);

  expect(removeAPortfolioFileWithName)
    .toHaveBeenCalledWith(req.params.fileName);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(deleteResult);
});


  test("In failure the function should send and log the error", async () => {
    const req = mockRequest({ params: { fileName: "itCv" } });
    const res = mockResponse();
    const error : Error = new Error ("An error has occured");
    (removeAPortfolioFileWithName as jest.Mock).mockRejectedValue(error);
    (errorhandler as jest.Mock).mockImplementation();
    await deleteOnePorfolioFileWithName(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
