import { UpdateResult } from "typeorm";
import { Token } from "../Entities/Token";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { TokenRepository } from "../Repositories/TokenRepository";
import { NullableOrUndefined } from "../Types/UtilityTypes";



export const createAToken : (tokenRecord : Partial<Token>)=>Promise<Token|null> = async (tokenRecord)=>{
    try {
        const token = TokenRepository.create(tokenRecord);
        return await TokenRepository.save(token);
    } catch (error) {
        errorhandler(error);
        throw error;
    }
}

export const findToken : (token:string)=>Promise<NullableOrUndefined<Token>> = async (token)=>{
    try {
        return await TokenRepository.findOneBy({token : token})
    } catch (error) {
        errorhandler(error)
        throw error
    }
}

export const modifyTokenRecord : (token:string) => Promise<UpdateResult |any> = async (token)=>{
    try {
        return await TokenRepository.update({token : token}, {isUsed :true})
    } catch (error) {
        errorhandler(error)
        throw error
    }
}