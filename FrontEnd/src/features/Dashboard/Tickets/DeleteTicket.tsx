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

type Props = {
  id: string;
  setTrigg: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteTicket = ({ id, setTrigg }: Props) => {
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
    <IconButton onClick={handleDeleteTicket}>
      <DeleteForever />
    </IconButton>
  );
};

export default DeleteTicket;
