import { Button } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate, type NavigateFunction } from "react-router";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "back-to-home-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');

    .bth-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.8rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.04em !important;
      text-transform: none !important;
      
      /* Increased brightness for text at rest */
      color: #c4cfee !important; 
      
      /* Increased background opacity from 0.12 to 0.22 */
      background: rgba(99, 102, 241, 0.22) !important; 
      
      /* Increased border opacity/visibility */
      border: 1px solid rgba(165, 180, 252, 0.6) !important; 
      
      border-radius: 999px !important;
      padding: 6px 18px !important;
      transition: all 0.22s ease !important;
    }

    .bth-btn:hover {
      color: #ffffff !important;
      border-color: rgba(99, 102, 241, 0.9) !important;
      background: rgba(99, 102, 241, 0.35) !important;
      transform: translateX(-4px) !important;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.4) !important;
    }

    .bth-btn .MuiButton-startIcon {
      transition: transform 0.22s ease;
    }
    
    .bth-btn:hover .MuiButton-startIcon {
      transform: translateX(-2px);
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const BackToHome = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate: NavigateFunction = useNavigate();
  const navigateToHome: () => void = () => {
    navigate("/");
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Button
      onClick={navigateToHome}
      startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "1rem !important" }} />}
      className="bth-btn"
      disableElevation
      disableRipple={false}
    >
      Back to Home
    </Button>
  );
};

export default BackToHome;