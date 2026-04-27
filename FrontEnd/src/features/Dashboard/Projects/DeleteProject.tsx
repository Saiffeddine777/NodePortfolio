import { DeleteForever } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useEffect, type SetStateAction } from "react";
import type React from "react";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleConfirmation, handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { api } from "../../../ApiService/ApiBrain.ts";


const injectStyles = () => {
  const id = "delete-technology-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    .dt-btn {
      width: 34px !important;
      height: 34px !important;
      border-radius: 9px !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      background: rgba(255,255,255,0.03) !important;
      color: rgba(255,255,255,0.28) !important;
      transition:
        color 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease !important;
    }
    .dt-btn:hover {
      color: #f87171 !important;
      background: rgba(248,113,113,0.1) !important;
      border-color: rgba(248,113,113,0.35) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 0 14px rgba(248,113,113,0.2) !important;
    }
    .dt-btn svg {
      font-size: 1rem !important;
      transition: transform 0.2s ease !important;
    }
    .dt-btn:hover svg {
      transform: rotate(-8deg) !important;
    }
  `;
  document.head.appendChild(style);
};


type Props = {
  id?: number ;
  setTrigg : React.Dispatch<SetStateAction<boolean>>
}

function DeleteProject({
  id , setTrigg
}: Props) {
    useEffect(()=>{injectStyles()},[])
    const handleDeleteProject : ()=>Promise <void> = async ()=>{
      try {
        const confirmation = await handleConfirmation("Delete Project?","This will be permantly deleted")
        if (!confirmation) return ;
        await api.delete(`/api/projects/${id}`)
        setTrigg (state=>!state)
        handleSuccess("Project Deleted","This project has been successfuly deleted")
      } catch (error) {
        handleComponentError(error)        
      }
    }
   
  return (
    <IconButton className="dt-btn" onClick={handleDeleteProject}>
      <DeleteForever/>
    </IconButton>
  )
}

export default DeleteProject