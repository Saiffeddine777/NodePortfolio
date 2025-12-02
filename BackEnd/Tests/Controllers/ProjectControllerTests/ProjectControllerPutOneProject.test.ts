import { UpdateResult } from "typeorm";
import { putOneProject } from "../../../Controllers/ProjectController";
import { errorhandler } from "../../../Handlers/ErrorHandlers";
import { modifyOneProject } from "../../../Services/ProjectService";
import Project from "../../../Entities/Project";


jest.mock("../../../Services/ProjectService")
jest.mock("../../../Handlers/ErrorHandlers" , ()=>({
    errorhandler :jest.fn()
}))

describe("testing the success and the failure of the function putOneProject of the Project Entity controller", ()=>{
   const mockRequest = ({body ={} , params ={id :1} , query={} , file : undefined} : {body?:Partial<Project> , params?:{id:number} , query?:any , file?: Express.Multer.File} ={},)=>({body , params , query}as any);
    const mockResponse =()=>{
    const res :any ={};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res ;
  }; 
    beforeEach(()=>{
        jest.clearAllMocks()
    }) 
    test("testing the success of the fucntion shoudl send an object",async ()=>{
        const updateResult = {affected :1} as UpdateResult
        const req  = mockRequest({params :{id:1} , body:{projectName : "test2"} } );
        const res = mockResponse();
        (modifyOneProject as jest.Mock).mockResolvedValue(updateResult);
        await putOneProject(req, res);
        expect(modifyOneProject).toHaveBeenCalledWith(1 ,{projectName : "test2"} , req.file);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updateResult);
    })
    test("testing the failure of the fucntion it should send an error",async ()=>{
        const req = mockRequest();
        const res = mockResponse();
        const error :Error = new Error ("Some error has happened");
        (modifyOneProject as jest.Mock).mockRejectedValue(error);
        (errorhandler as jest.Mock).mockImplementation();
        await putOneProject(req,res);
        expect(errorhandler).toHaveBeenCalledWith(error);
        expect (res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error)

    })
})