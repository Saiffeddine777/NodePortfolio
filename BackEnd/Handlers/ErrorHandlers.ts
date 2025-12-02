import { existsSync, mkdirSync, writeFileSync ,appendFileSync} from "fs"
import path from "path"

export const errorhandler : (error :unknown)=>Promise <void> = async function(error){
    try {
        const dataInstance :Date = new Date()
        const time : string = dataInstance.toLocaleTimeString()
        const date :string = dataInstance.toLocaleDateString() 
        const fileName :string= date.replaceAll("/","-").concat(".log")
        const place = path.resolve(__dirname ,".." ,"logs") 
        const errorPath:string = path.resolve(place , fileName)
        const errorString =`[${date} ${time}] ` + (error instanceof Error ? error.stack : JSON.stringify(error));
        if (!existsSync(place)){
              mkdirSync(place)
             if (!existsSync (errorPath)){
                writeFileSync(errorPath , errorString)  
             }
        }
        if(!existsSync(errorPath)){
            writeFileSync(errorPath , errorString)  
        }
        else appendFileSync(errorPath, (`\n`).concat(errorString)); 
    } catch (error) {
        console.log(error)
    }
}