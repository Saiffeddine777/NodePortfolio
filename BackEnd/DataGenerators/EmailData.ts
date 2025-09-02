import { EmailInterface } from "../Types/UtilityTypes";

export const createUserEmailDataFactoryFunction :(userName :string ,userPassword:string , email:string)=> EmailInterface =(userName ,userPassword , email)=>{
    return{
        subject : `Welcome ${userName}`,
        to : email,
        text :`Hello ${userName}
               We hope tha you are doing fine
               You are now a memeber of Saif's portfolio 
               This is your password 
               
               ${userPassword}
               Make sure to not use it and for security purposes plaese delete this message 
               
               Best Regards
               `
    }

}