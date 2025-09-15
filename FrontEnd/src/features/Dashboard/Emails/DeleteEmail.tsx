import type { SetStateAction } from "react";
import type React from "react";
import { handleSuccess } from "../../../Helpers/Sweetalert";
import { handleComponentError } from "../../../Helpers/ErrorHandler";
import axios from "axios";
import { IconButton } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";

type Props = {
  id?:number;
  setTrigg : React.Dispatch<SetStateAction<boolean>>
}
const apiUrl :string = import.meta.env.VITE_API_URL
function DeleteEmail({
  id, setTrigg
}: Props) {
  
  const handleDeleteEmail :()=>Promise<void> =async () =>{
    try {
      await axios.delete(`${apiUrl}/api/emails/${id}`)
      setTrigg(state=>!state)
      handleSuccess("Email deleted" , "Email has been successfully deleted")
    } catch (error) {
      handleComponentError(error)
    }
  }
  return (
     <IconButton onClick={handleDeleteEmail}>
      <DeleteForever/>
     </IconButton>
  )
}

export default DeleteEmail