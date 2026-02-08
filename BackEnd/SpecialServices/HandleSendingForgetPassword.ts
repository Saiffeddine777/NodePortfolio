import { errorhandler } from "../Handlers/ErrorHandlers";
import { sendEmail } from "../Handlers/NodeMailerHandler"
import crypto  from "crypto"
import { createAToken } from "../Services/TokenService";

export const handleSendingForgetPasswordEmail :( email :string , url: string)=>Promise<any> = async (email , url)=>{
    try {
       const token = crypto.randomBytes(64).toString("base64");
       const sentUrlToChangePassword :string = `${url}/changepassword/${encodeURIComponent(token)}`
       await createAToken({email , token})
       const result = await sendEmail({
        to : email ,
        subject:`[Saif's Profile] forgot the password`,
        text :`
        Hello 

        Thank you for you interest in saif's profile ,
        Please make sure to visit this link to change your account's password,
        Link : ${sentUrlToChangePassword}
        
        This link is available for the next 30 min ,

        Have a good day
        `
       })
        return result
    } catch (error) {
        errorhandler(error)
    }
}