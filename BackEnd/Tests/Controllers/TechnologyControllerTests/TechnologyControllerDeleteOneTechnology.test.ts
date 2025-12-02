import { errorhandler } from "../../../Handlers/ErrorHandlers"
import { deleteOneTechnology  } from "../../../Controllers/TechnologyController"
import { removeOneTechnology } from "../../../Services/TechnologyService"
import { DeleteResult } from "typeorm"


jest.mock("../../../Services/TechnologyService")
jest.mock("../../../Handlers/ErrorHandlers", ()=>({
    errorhandler : jest.fn()
}))

describe ("Testing the success or the failure of  deleteOneTechnology of the technology entity Controller", ()=>{
    const mockRequest = ({
        body ={},
        params ={id :1},
        query = {},
        file =undefined
    }:{
        body?:any,
        params  ?:{id:number},
        query ?: any,
        file ?: Express.Multer.File
    }={})=>({
        body , params , query , file
    } as any);

    const mockResponse = ()=>{
        const res :any ={};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    }
    
    const deleteResult  = {affected:1} as DeleteResult;

    beforeEach(()=>{
        jest.clearAllMocks();
    })

    test("Testing the success or the failure of  deleteOneTechnology Should send a delete result",async()=>{  
        const req = mockRequest({params:{id:1}});
        const res = mockResponse();
        (removeOneTechnology as jest.Mock).mockResolvedValue(deleteResult);
        await deleteOneTechnology(req, res);
        expect(removeOneTechnology).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(deleteResult);
    })    
    test("testing the failure of the function deleteOneTechnology  as it should send an error",async()=>{
        const req = mockRequest();
        const res = mockResponse();
        const error :Error = new Error ("an Error has occured");
        (removeOneTechnology as jest.Mock).mockRejectedValue(error);
        (errorhandler as jest.Mock).mockImplementation();
        await deleteOneTechnology(req,res);
        expect(removeOneTechnology).toHaveBeenCalled();
        expect(errorhandler).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    })    
})