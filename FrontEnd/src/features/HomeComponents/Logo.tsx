import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import logo from "/terminal-svgrepo-com.svg";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "logo-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    .logo-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.22s ease, opacity 0.22s ease;
    }
    .logo-wrap:hover {
      transform: scale(1.03);
      opacity: 0.85;
    }

    /* Icon container with subtle indigo glow ring */
    .logo-icon-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.22);
      transition: background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
    }
    .logo-wrap:hover .logo-icon-wrap {
      background: rgba(99,102,241,0.18);
      border-color: rgba(99,102,241,0.45);
      box-shadow: 0 0 18px rgba(99,102,241,0.28);
    }

    .logo-icon-wrap img {
      width: 22px;
      height: 22px;
      object-fit: contain;
      /* Tint the SVG to match the indigo palette */
      filter: invert(1) brightness(0.9) sepia(1) hue-rotate(210deg) saturate(3);
    }

    /* Wordmark */
    .logo-wordmark {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.15rem !important;
      font-weight: 400 !important;
      font-style: italic !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1 !important;
      user-select: none;
    }
    .logo-wordmark span {
      color: #818cf8;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const Logo = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();
  const handleNavigateToHome: () => void = () => {
    navigate("/");
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="logo-wrap" onClick={handleNavigateToHome}>

      {/* Icon */}
      <Box className="logo-icon-wrap">
        <Box
          component="img"
          src={logo}
          alt="Logo"
        />
      </Box>

      {/* Wordmark */}
      <Typography className="logo-wordmark">
        dev<span>.</span>folio
      </Typography>

    </Box>
  );
};

export default Logo;