import { Box, Typography } from "@mui/material";
import React from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "title-technologies-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    .tot-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      position: relative;
    }

    /* Faint horizontal rule on each side of the tag */
    .tot-wrap::before,
    .tot-wrap::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 18%;
      height: 1px;
      background: linear-gradient(
        to var(--side),
        transparent,
        rgba(99,102,241,0.25)
      );
    }
    .tot-wrap::before { right: 52%; --side: left; }
    .tot-wrap::after  { left:  52%; --side: right; }

    .tot-tag {
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
    }

    .tot-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: clamp(1.6rem, 4vw, 2.2rem) !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      text-align: center !important;
    }

    .tot-sub {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      color: rgba(255,255,255,0.38) !important;
      text-align: center !important;
      letter-spacing: 0.01em !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const TitleOfTechnologies = ({}: Props) => {
  React.useEffect(() => { injectStyles(); }, []);

  return (
    <Box className="tot-wrap" sx={{ mt: "5%", mb: "5%" }}>
      <div className="tot-tag">Expertise</div>
      <Typography className="tot-title">Skill Set</Typography>
      <Typography className="tot-sub">
        Technologies I work with every day.
      </Typography>
    </Box>
  );
};

export default TitleOfTechnologies;