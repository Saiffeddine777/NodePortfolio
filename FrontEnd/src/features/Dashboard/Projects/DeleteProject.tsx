import { DeleteForever } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import axios from "axios";
import type { SetStateAction } from "react";
import type React from "react";
import { handleComponentError } from "../../../Helpers/ErrorHandler";
import { handleSuccess } from "../../../Helpers/Sweetalert";

type Props = {
  id?: number ;
  setTrigg : React.Dispatch<SetStateAction<boolean>>
}
const apiUrl:string = import.meta.env.VITE_API_URL
function DeleteProject({
  id , setTrigg
}: Props) {
    const handleDeleteProject : ()=>Promise <void> = async ()=>{
      try {
        await axios.delete(`${apiUrl}/api/projects/${id}`)
        setTrigg (state=>!state)
        handleSuccess("Project Deleted","This project has been successfuly deleted")
      } catch (error) {
        handleComponentError(error)        
      }
    }
   
  return (
    <IconButton onClick={handleDeleteProject}>
      <DeleteForever/>
    </IconButton>
  )
}

export default DeleteProject