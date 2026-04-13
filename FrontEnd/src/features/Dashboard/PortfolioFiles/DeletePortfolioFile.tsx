import type React from "react";
import { api } from "../../../ApiService/ApiBrain.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleConfirmation, handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { IconButton } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";

type Props = {
  id?: number;
  setTrigger?: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeletePortfolioFile = ({ id, setTrigger }: Props) => {
  const handleDeleteOneFile: () => Promise<void> = async () => {
    try {
      const confirmation = await handleConfirmation("Delete File?" , "This action can't be undone!")
      if (! confirmation ) return
      await api.delete(`/api/files/${id}`);
      setTrigger && setTrigger((state) => !state);
      handleSuccess("Message", "File has been deleted");
    } catch (error) {
      handleComponentError(error);
    }
  };
  return (
    <IconButton onClick={handleDeleteOneFile}>
      <DeleteForever />
    </IconButton>
  );
};

export default DeletePortfolioFile;
