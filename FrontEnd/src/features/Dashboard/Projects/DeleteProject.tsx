import { DeleteForever } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import type { SetStateAction } from "react";
import type React from "react";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {
  id?: number ;
  setTrigg : React.Dispatch<SetStateAction<boolean>>
}

function DeleteProject({
  id , setTrigg
}: Props) {
    const handleDeleteProject : ()=>Promise <void> = async ()=>{
      try {
        await api.delete(`/api/projects/${id}`)
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