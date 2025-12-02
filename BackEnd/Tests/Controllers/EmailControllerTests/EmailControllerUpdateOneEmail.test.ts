import { UpdateResult } from "typeorm";
import { putOneEmail } from "../../../Controllers/EmailController";
import { Email } from "../../../Entities/Email";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { updateEmail } from "../../../Services/EmailService";

jest.mock("../../../Services/EmailService");
jest.mock("../../../Handlers/ErrorHandlers", () => ({
  errorhandler: jest.fn(),
}));

describe(" testing putOneEmail the controller that tests the modification for one email entity", () => {
  const mockRequest = ({
    params = { id: 1 },
    body = {},
    query = {},
  }: { params?: { id: number }; body?: Partial<Email>; query?: any } = {}) =>
    ({ params, body, query } as any);

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("This test tests the success of the putOneEmail function should respond with a message and a status of 200", async () => {
    const updateResult= {affected :1} as UpdateResult
    const req = mockRequest({params:{id:1}});
    const res = mockResponse();
    (updateEmail as jest.Mock).mockResolvedValue({affected:1}) ;
    await putOneEmail(req, res);
    expect (updateEmail).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({message : "Email has been updated" ,...updateResult})
  });

  test("This test tests the failure of the putOneEmail function should respond with a message and a status of 500", async () => {
    const req  = mockRequest();
    const res = mockResponse();
    const error = new Error ("Some error happened");
    (errorhandler as jest.Mock).mockImplementation();
    (updateEmail as jest.Mock).mockRejectedValue(error);
    await putOneEmail(req, res);
    expect(errorhandler).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(error)

  });


});
