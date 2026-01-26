import { getCVPortfolioFile } from "../../../Controllers/PortfolioFileController";
import { PortfolioFile } from "../../../Entities/PortfolioFile";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { findCVportfolioFiles } from "../../../Services/PortfolioFileService";


jest.mock("../../../Services/PortfolioFileService");

jest.mock ("../../../Handlers/ErrorHandlers", ()=>({
    errorhandler : jest.fn()
}));

describe('getCVPortfolioFile should send the CV file when given there names',  ()=>{
          
          const mockRequest = ({
            params = {  itcv :"itCv" , fullCv :"fullStoryCV" },
            body = {},
            query = {},
            file = undefined,
          }: {
            params?: { itcv :string , fullCv :string };
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
             const portfolioFileInDataBase1: Partial<PortfolioFile> = {
                id: 1,
                publicId: "fullStoryCV",
                publicUrl: "https//cloudserviceexmaple.com",
                fileName: "test technology",
                createdAt: new Date("2024-01-10T12:00:00Z"),
                updatedAt: new Date("2024-01-15T12:00:00Z"),
            };

            
             const portfolioFileInDataBase2: Partial<PortfolioFile> = {
                id: 1,
                publicId: "itCv",
                publicUrl: "https//cloudserviceexmaple.com",
                fileName: "test technology",
                createdAt: new Date("2024-01-10T12:00:00Z"),
                updatedAt: new Date("2024-01-15T12:00:00Z"),
            };
    
    test('send them in an array if the gven their names', async ()=>{
        const req = mockRequest({params:{itcv :"itCv" , fullCv :"fullStoryCV" }});
        const res = mockResponse();
        (findCVportfolioFiles  as jest.Mock).mockResolvedValue([portfolioFileInDataBase1 , portfolioFileInDataBase2]);
        await getCVPortfolioFile(req, res);
        expect(findCVportfolioFiles).toHaveBeenCalledWith(["fullStoryCV" ,"itCv"])
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([portfolioFileInDataBase1 , portfolioFileInDataBase2])
    });

    test('send the error and log it if the fucntion fails', async ()=>{
        const req = mockRequest();
        const res = mockResponse();
        const error : Error = new Error("We have an error");
        (findCVportfolioFiles  as jest.Mock).mockRejectedValue(error);
        (errorhandler as jest.Mock).mockImplementation();
        await getCVPortfolioFile(req,res);
        expect(errorhandler).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);

    });
});
