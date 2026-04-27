import { Box } from "@mui/material";
import Container from "./Container.tsx";
import Menu from "./Menu.tsx";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "dashboard-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Root shell ── */
    .db-shell {
      display: flex;
      flex-direction: row;
      width: 100vw;
      height: 100vh;
      box-sizing: border-box;
      overflow: hidden;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 60% 50% at -5% 0%, rgba(99,102,241,0.12) 0%, transparent 55%),
        radial-gradient(ellipse 45% 40% at 105% 100%, rgba(129,140,248,0.08) 0%, transparent 50%);
      font-family: 'DM Sans', sans-serif;
      padding: 16px;
      gap: 16px;
    }

    /* ── Menu column ── */
    .db-menu-col {
      display: flex;
      flex-direction: column;
      height: 100%;
      flex-shrink: 0;
      border-radius: 18px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      transition: border-color 0.2s ease;
    }
    .db-menu-col:hover {
      border-color: rgba(99,102,241,0.18);
    }

    /* ── Main content column ── */
    .db-content-col {
      flex: 1;
      height: 100%;
      border-radius: 18px;
      background: rgba(255,255,255,0.022);
      border: 1px solid rgba(255,255,255,0.06);
      overflow: auto;
      /* subtle inner scroll */
      scrollbar-width: thin;
      scrollbar-color: rgba(99,102,241,0.25) transparent;
    }
    .db-content-col::-webkit-scrollbar {
      width: 5px;
    }
    .db-content-col::-webkit-scrollbar-track {
      background: transparent;
    }
    .db-content-col::-webkit-scrollbar-thumb {
      background: rgba(99,102,241,0.25);
      border-radius: 999px;
    }
    .db-content-col::-webkit-scrollbar-thumb:hover {
      background: rgba(99,102,241,0.45);
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const Dashboard = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  return (
    <Box className="db-shell">

      {/* ── Sidebar ── */}
      <Box className="db-menu-col">
        <Menu />
      </Box>

      {/* ── Main content ── */}
      <Box className="db-content-col">
        <Container />
      </Box>

    </Box>
  );
};

export default Dashboard;