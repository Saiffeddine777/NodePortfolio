import { DeleteResult, UpdateResult } from "typeorm";
import bcrypt from "bcrypt"
import { User } from "../Entities/User";
import { UserRepository } from "../Repositories/User.repository";
import { passwordGenerator } from "../Helpers/PasswordGenerator";

export const createUser: (
  user : User
) => Promise<Partial<User> | undefined> = async (user) => {
  try {
    const generatedPassoword :string = passwordGenerator()
    const hashedPassword :string = await bcrypt.hash(generatedPassoword , 10) 
    user.password = hashedPassword
    const userCreated: User = UserRepository.create(user);
    await UserRepository.save(userCreated);
    userCreated.password = generatedPassoword
    return userCreated
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findAllUsers : ()=>Promise<User[]|undefined> = async()=>{
  try {
    return await UserRepository.find()
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findOneUser : (id :number)=>Promise<User| undefined|null> = async (id)=>{
  try {
    return await UserRepository.findOneBy({id})
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeOneUser :(id:number) =>Promise<DeleteResult | undefined> = async (id)=>{
  try {
    return await UserRepository.delete(id) 
  } catch (error) {
    console.error(error);
    throw error;
  }
};
 
export const modifyOneUser :(id:number, data: Partial<User>)=>Promise<UpdateResult|undefined> = async (id , data)=>{
  try {
    return await UserRepository.update(id,data)
  } catch (error) {
    console.error(error);
    throw error;
  }
}