import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type React from "react";
import type { SetStateAction } from "react";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { useNavigate } from "react-router";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {
  id?: number;
  setTrigg?: React.Dispatch<SetStateAction<boolean>>;
  componentName ?:string
};
const DeleteUser = ({ id, setTrigg , componentName }: Props) => {
  const navigate = useNavigate()
  const handleDeleteUser: () => Promise<void> = async () => {
    try {
      const result = await api.delete(`$/api/users/${id}`);
      if (result.data && !componentName) {
        setTrigg && setTrigg((state) => {
            return !state
        });
        handleSuccess("Deleting User", "User has been successfully deleted!");
      }
      else if (componentName){
        navigate("/dashboard/userlist")
        handleSuccess("Deleting User", "User has been successfully deleted!");
      }
    } catch (error) {
      handleComponentError(error);
    }
  };
  return (
    <IconButton title="Delete" onClick={handleDeleteUser}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteUser;
