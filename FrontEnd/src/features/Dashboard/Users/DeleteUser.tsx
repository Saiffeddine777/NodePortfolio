import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type React from "react";
import type { SetStateAction } from "react";
import { handleConfirmation, handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { useNavigate } from "react-router";
import { api } from "../../../ApiService/ApiBrain.ts";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "delete-user-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    .du-btn {
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
    .du-btn:hover {
      color: #f87171 !important;
      background: rgba(248,113,113,0.1) !important;
      border-color: rgba(248,113,113,0.35) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 0 14px rgba(248,113,113,0.2) !important;
    }
    .du-btn svg {
      font-size: 1rem !important;
      transition: transform 0.2s ease !important;
    }
    .du-btn:hover svg {
      transform: rotate(-8deg) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {
  id?: number;
  setTrigg?: React.Dispatch<SetStateAction<boolean>>;
  componentName?: string;
};

const DeleteUser = ({ id, setTrigg, componentName }: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();

  const handleDeleteUser: () => Promise<void> = async () => {
    try {
      const confirmation = await handleConfirmation(
        "Delete this user?",
        "This will be permanently deleted"
      );
      if (!confirmation) return;
      const result = await api.delete(`/api/users/${id}`);
      if (result.data && !componentName) {
        setTrigg && setTrigg((state) => !state);
        handleSuccess("Deleting User", "User has been successfully deleted!");
      } else if (componentName) {
        navigate("/dashboard/userlist");
        handleSuccess("Deleting User", "User has been successfully deleted!");
      }
    } catch (error) {
      handleComponentError(error);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <IconButton className="du-btn" title="Delete" onClick={handleDeleteUser}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteUser;