import type { SetStateAction } from "react";
import type React from "react";
import { handleConfirmation, handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { IconButton } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {
  id?:number;
  setTrigg : React.Dispatch<SetStateAction<boolean>>
}
function DeleteEmail({
  id, setTrigg
}: Props) {
  
  const handleDeleteEmail :()=>Promise<void> =async () =>{
    try {
      const confirmation = await handleConfirmation("Delete Email?","This will be permantly deleted")
      if (!confirmation) return ;
      await api.delete(`/api/emails/${id}`)
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