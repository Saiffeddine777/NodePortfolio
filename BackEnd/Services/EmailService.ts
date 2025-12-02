import { DeleteResult, UpdateResult } from "typeorm";
import { Email } from "../Entities/Email";
import { EmailRepository } from "../Repositories/EmailRepository";
import { errorhandler } from "../Handlers/ErrorHandlers";

export const createAnEmail: (email: Partial<Email>) => Promise<Email> = async (
  email
) => {
  try {
    const emailData: Email = EmailRepository.create(email);
    return await EmailRepository.save(emailData);
  } catch (error) {
    errorhandler(error)
    throw error;
  }
};

export const findAllEmails: () => Promise<Email[]> = async () => {
  try {
    return await EmailRepository.find();
  } catch (error) {
    errorhandler(error)
    throw error;
  }
};

export const findOneEmail: (
  id: number
) => Promise<Email | null | undefined> = async (id) => {
  try {
    return await EmailRepository.findOneBy({ id });
  } catch (error) {
    errorhandler(error)
    throw error;
  }
};

export const removeOneEmail : (
   id:number
)=>Promise<DeleteResult> = async (id)=>{
    try {
        return await EmailRepository.delete({id}) 
    } catch (error) {
      errorhandler(error)
        throw error 
    }
}

export const updateEmail : (
  id : number
)=>Promise<UpdateResult> = async (id) =>{
  try {
    return await EmailRepository.update(id, {isRead : true})
  } catch (error) {
    errorhandler(error)
    throw error;
  }
}
