import type { SetStateAction } from "react";
import type React from "react";
import { handleConfirmation, handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { IconButton } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { api } from "../../../ApiService/ApiBrain.ts";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "delete-email-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    .de-btn {
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
    .de-btn:hover {
      color: #f87171 !important;
      background: rgba(248,113,113,0.1) !important;
      border-color: rgba(248,113,113,0.35) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 0 14px rgba(248,113,113,0.2) !important;
    }
    .de-btn svg {
      font-size: 1rem !important;
      transition: transform 0.2s ease !important;
    }
    .de-btn:hover svg {
      transform: rotate(-8deg) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {
  id?: number;
  setTrigg: React.Dispatch<SetStateAction<boolean>>;
};

function DeleteEmail({ id, setTrigg }: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const handleDeleteEmail: () => Promise<void> = async () => {
    try {
      const confirmation = await handleConfirmation(
        "Delete Email?",
        "This will be permanently deleted"
      );
      if (!confirmation) return;
      await api.delete(`/api/emails/${id}`);
      setTrigg((state) => !state);
      handleSuccess("Email deleted", "Email has been successfully deleted");
    } catch (error) {
      handleComponentError(error);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <IconButton className="de-btn" onClick={handleDeleteEmail}>
      <DeleteForever />
    </IconButton>
  );
}

export default DeleteEmail;