import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "profile-row-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');

    .pr-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .pr-row:last-child {
      border-bottom: none;
    }

    .pr-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      flex-shrink: 0;
    }

    .pr-value {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      font-weight: 500 !important;
      color: rgba(255,255,255,0.68) !important;
      text-align: right !important;
    }

    .pr-value.empty {
      color: rgba(255,255,255,0.18) !important;
      font-style: italic !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type ProfileRowProps = {
  label: string;
  value?: string;
};

const ProfileRow = ({ label, value }: ProfileRowProps) => {
  useEffect(() => { injectStyles(); }, []);

  return (
    <Box className="pr-row">
      <Typography className="pr-label">{label}</Typography>
      <Typography className={`pr-value ${!value ? "empty" : ""}`}>
        {value || "—"}
      </Typography>
    </Box>
  );
};

export default ProfileRow;