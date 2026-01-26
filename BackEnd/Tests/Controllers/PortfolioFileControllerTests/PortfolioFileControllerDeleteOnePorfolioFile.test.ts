import { DeleteResult } from "typeorm";
import { deleteOnePorfolioFile } from "../../../Controllers/PortfolioFileController";
import { PortfolioFile } from "../../../Entities/PortfolioFile";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { removeOnePortfolioFile } from "../../../Services/PortfolioFileService";


jest.mock("../../../Services/PortfolioFileService");

jest.mock("../../../Handlers/ErrorHandlers", ()=>({
    errorhandler : jest.fn()
}));

describe('deleteOnePorfolioFile Shoudl delete on entity', ()=>{
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

    test('when successful this fuction should delete the entity and send an object', async ()=>{
        const deleteResult  ={affected : 1}as DeleteResult; 
        const req = mockRequest({params:{id :1}});
        const res = mockResponse();
        (removeOnePortfolioFile as jest.Mock).mockResolvedValue(deleteResult);
        await deleteOnePorfolioFile(req, res);
        expect(removeOnePortfolioFile).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(deleteResult);
    });

    test('When failed this function should send and log the error', async ()=>{
        const req = mockRequest();
        const res = mockResponse();
        const error :Error = new Error("An unexpected error has occured");
        (removeOnePortfolioFile as jest.Mock).mockRejectedValue(error);
        (errorhandler as jest.Mock).mockImplementation();
        await deleteOnePorfolioFile(req, res);
        expect(errorhandler).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });

});

