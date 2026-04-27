import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { api } from "../../../ApiService/ApiBrain.ts";
import {
  handleConfirmation,
  handleSuccess,
} from "../../../Helpers/Sweetalert.ts";
import { IconButton } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import type React from "react";
import { useEffect } from "react";


const injectStyles = () => {
  const id = "delete-ticket-styles";
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
  id: string;
  setTrigg: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteTicket = ({ id, setTrigg }: Props) => {
  useEffect(()=>{injectStyles()},[])
  const handleDeleteTicket: () => Promise<void> = async () => {
    const confirmation = await handleConfirmation(
      "Delete Ticket?",
      "This action cannot be undone.",
    );
    if (!confirmation) return;
 
    try {
      const result: AxiosResponse = await api.delete(
        `/api/tickets/deletejiraticket/${id}`,
      );

      handleSuccess("Success", result.data.message);
    } catch (error) {
      handleComponentError(error);
    } finally {
      setTrigg((state) => !state);
    }
  };

  return (
    <IconButton className="dt-btn" onClick={handleDeleteTicket}>
      <DeleteForever />
    </IconButton>
  );
};

export default DeleteTicket;
