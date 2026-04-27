import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "welcome-dashboard-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    .wd-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 48px;
      font-family: 'DM Sans', sans-serif;
      text-align: center;
    }

    /* ── Glow orb behind the content ── */
    .wd-orb {
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
      pointer-events: none;
      filter: blur(40px);
    }

    /* ── Icon badge ── */
    .wd-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.25);
      font-size: 1.8rem;
      margin-bottom: 28px;
      position: relative;
      z-index: 1;
    }

    /* ── Tag ── */
    .wd-tag {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #818cf8;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 999px;
      padding: 4px 14px;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }

    /* ── Title ── */
    .wd-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: clamp(1.8rem, 4vw, 2.6rem) !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 16px !important;
      position: relative;
      z-index: 1;
    }
    .wd-title span {
      color: #818cf8;
      font-style: italic;
    }

    /* ── Subtitle ── */
    .wd-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.35) !important;
      line-height: 1.8 !important;
      max-width: 360px;
      position: relative;
      z-index: 1;
    }

    /* ── Divider ── */
    .wd-divider {
      width: 48px;
      height: 2px;
      border-radius: 999px;
      background: linear-gradient(90deg, #6366f1, #818cf8);
      margin: 28px auto 0;
      opacity: 0.5;
      position: relative;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const WelcomeToDashboard = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  return (
    <Box className="wd-wrap">

      {/* Ambient glow */}
      <div className="wd-orb" />

      {/* Icon */}
      <div className="wd-badge">⚡</div>

      {/* Tag */}
      <div className="wd-tag">Admin Panel</div>

      {/* Title */}
      <Typography className="wd-title">
        Welcome back, <span>admin.</span>
      </Typography>

      {/* Subtitle */}
      <Typography className="wd-subtitle">
        Select a section from the sidebar to manage your portfolio content.
      </Typography>

      {/* Accent line */}
      <div className="wd-divider" />

    </Box>
  );
};

export default WelcomeToDashboard;