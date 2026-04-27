import { Backdrop } from "@mui/material";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "full-page-loader-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    /* ── Backdrop ── */
    .fpl-backdrop {
      background: rgba(11,12,16,0.85) !important;
      backdrop-filter: blur(6px) !important;
    }

    /* ── Spinner wrapper ── */
    .fpl-spinner-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    /* ── Custom SVG ring ── */
    .fpl-ring {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: 3px solid rgba(99,102,241,0.15);
      border-top-color: #818cf8;
      animation: fpl-spin 0.75s linear infinite;
      box-shadow: 0 0 24px rgba(99,102,241,0.35);
    }

    @keyframes fpl-spin {
      to { transform: rotate(360deg); }
    }

    /* ── Pulse dot ── */
    .fpl-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #818cf8;
      animation: fpl-pulse 1.2s ease-in-out infinite;
      box-shadow: 0 0 10px rgba(99,102,241,0.6);
    }
    @keyframes fpl-pulse {
      0%, 100% { opacity: 0.3; transform: scale(0.85); }
      50%       { opacity: 1;   transform: scale(1.15); }
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = { open: boolean };

const FullPageLoader = ({ open }: Props) => {
  useEffect(() => { injectStyles(); }, []);

  return (
    <Backdrop
      className="fpl-backdrop"
      open={open}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <div className="fpl-spinner-wrap">
        <div className="fpl-ring" />
        <div className="fpl-dot" />
      </div>
    </Backdrop>
  );
};

export default FullPageLoader;