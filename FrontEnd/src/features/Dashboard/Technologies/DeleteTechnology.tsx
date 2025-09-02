import { IconButton } from "@mui/material"
import type { SetStateAction } from "react"
import type React from "react"
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler";

type Props = {
  setTrigg: React.Dispatch<SetStateAction<boolean>>
  id ?: number
}
const apiUrl = import.meta.env.VITE_API_URL
function DeleteTechnology({setTrigg , id}: Props) {
  
  
  const handleDeleteTechnology : ()=>Promise<void> = async ()=>{
    try {
      await axios.delete(`${apiUrl}/api/technologies/${id}`)
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