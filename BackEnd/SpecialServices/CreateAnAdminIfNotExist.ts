import { User, UserRole } from "../Entities/User";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { UserRepository } from "../Repositories/UserRepository";
import bcrypt from "bcrypt"


const emailAccount : undefined|string = process.env.ADMIN_ACCOUNT
const passwordAccount  : undefined | string = process.env.ADMIN_PASSWORD

export default async function createAnAdminifNotExist() : Promise<void> {
    try {
        const admin :User | null = await UserRepository.findOne({where : {email : process.env.ADMIN_ACCOUNT}})
        if (admin){
            return;
        }
        else {
            const hashedPassword :string =  await bcrypt.hash( passwordAccount as string , Number(process.env.BCRYPT_SALT as string))
            const createdAdmin = UserRepository.create({
            email : emailAccount as string ,
            role : UserRole.ADMIN,
            firstName  :"Saiffeddine",
            lastName : "Zouaghi",
            password :hashedPassword, 
            occupation : "developer",
            userName : "UseROne11",
            phoneNumber  : "+216 54040987"
           })
           await UserRepository.save (createdAdmin)
           console.log("Admin has been created.")
        }
    } catch (error) {
        errorhandler(error)
        throw error
    }
}