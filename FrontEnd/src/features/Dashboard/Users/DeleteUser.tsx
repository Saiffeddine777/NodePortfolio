import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type React from "react";
import type { SetStateAction } from "react";
import axios from "axios";
import { handleSuccess } from "../../../Helpers/Sweetalert";
import { handleComponentError } from "../../../Helpers/ErrorHandler";
import { useNavigate } from "react-router";

type Props = {
  id?: number;
  setTrigg?: React.Dispatch<SetStateAction<boolean>>;
  componentName ?:string
};
const apiUrl = import.meta.env.VITE_API_URL;
const DeleteUser = ({ id, setTrigg , componentName }: Props) => {
  const navigate = useNavigate()
  const handleDeleteUser: () => Promise<void> = async () => {
    try {
      const result = await axios.delete(`${apiUrl}/api/users/${id}`);
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
