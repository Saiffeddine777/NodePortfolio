import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { removeOneEmail } from "../../../Services/EmailService";
import { deleteOneEmail } from "../../../Controllers/EmailController";
import { DeleteResult } from "typeorm";
jest.mock("../../../Services/EmailService");

jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe("Testing the email entity controller deleteOneEmail in both cases of success or failure", () => {
  const mockRequest = ({
    params = { id: 1 },
    body = {},
    query = {},
  }: {
    params?: { id: number };
    body?: any;
    query?: any;
  } = {}) => ({ body, params, query } as any);

  const mockResponse = () => {
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deleteOneEmail success case should send a string message", async () => {
    const deleteResult = { affected: 1 } as DeleteResult;
    const req = mockRequest({ params: { id: 1 } });
    const res = mockResponse();
    (removeOneEmail as jest.Mock).mockResolvedValue({ affected: 1 });
    await deleteOneEmail(req, res);
    expect(removeOneEmail).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email has been deleted",
      ...deleteResult,
    });
  });

  test("deleteOneEmail the failure case should send a string message", async () => {
    const req = mockRequest({ params: { id: 1 } });
    const res = mockResponse();
    const error = new Error("Some error happened");
    (removeOneEmail as jest.Mock).mockRejectedValue(error);
    await deleteOneEmail(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});


