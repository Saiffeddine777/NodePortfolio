import { IconButton } from "@mui/material"
import type { SetStateAction } from "react"
import type React from "react"
import DeleteIcon from "@mui/icons-material/Delete";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {
  setTrigg: React.Dispatch<SetStateAction<boolean>>
  id ?: number
}
function DeleteTechnology({setTrigg , id}: Props) {
  
  
  const handleDeleteTechnology : ()=>Promise<void> = async ()=>{
    try {
      await api.delete(`/api/technologies/${id}`)
      setTrigg(state=>!state)
    } catch (error) {
      handleComponentError(error)
    }
  }

  
  return (
    <IconButton onClick={handleDeleteTechnology}>
      <DeleteIcon/>
    </IconButton>
  )
}

export default DeleteTechnology