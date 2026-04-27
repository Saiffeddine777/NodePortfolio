import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router";
import {
  AccountTree,
  Biotech,
  Email,
  Home,
  SupervisedUserCircle,
  FileUpload,
  AirplaneTicket,
} from "@mui/icons-material";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "menu-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Sidebar shell ── */
    .menu-shell {
      width: 240px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 24px 14px;
      box-sizing: border-box;
      font-family: 'DM Sans', sans-serif;
    }

    /* ── Wordmark ── */
    .menu-wordmark {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.15rem !important;
      font-weight: 400 !important;
      font-style: italic !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      padding: 0 10px;
      margin-bottom: 6px !important;
    }
    .menu-wordmark span {
      color: #818cf8;
    }

    /* ── Section label ── */
    .menu-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.65rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.14em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.25) !important;
      padding: 0 10px;
      margin-bottom: 10px !important;
      margin-top: 20px !important;
    }

    /* ── Divider ── */
    .menu-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 10px 10px 20px;
    }

    /* ── Nav item ── */
    .menu-item {
      border-radius: 12px !important;
      margin-bottom: 4px !important;
      padding: 9px 12px !important;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease !important;
      border: 1px solid transparent !important;
      position: relative;
    }

    /* Default */
    .menu-item-default {
      background: transparent !important;
    }
    .menu-item-default:hover {
      background: rgba(255,255,255,0.04) !important;
      border-color: rgba(255,255,255,0.07) !important;
      transform: translateX(3px) !important;
    }

    /* Active */
    .menu-item-active {
      background: rgba(99,102,241,0.14) !important;
      border-color: rgba(99,102,241,0.3) !important;
    }
    .menu-item-active:hover {
      background: rgba(99,102,241,0.2) !important;
      border-color: rgba(99,102,241,0.45) !important;
    }

    /* Active glow pip */
    .menu-item-active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      border-radius: 0 3px 3px 0;
      background: #818cf8;
      box-shadow: 0 0 10px rgba(99,102,241,0.6);
    }

    /* ── Icon ── */
    .menu-icon-default {
      color: rgba(255,255,255,0.3) !important;
      min-width: 38px !important;
      transition: color 0.2s ease !important;
    }
    .menu-item-default:hover .menu-icon-default {
      color: rgba(255,255,255,0.6) !important;
    }
    .menu-icon-active {
      color: #818cf8 !important;
      min-width: 38px !important;
    }

    /* ── Label ── */
    .menu-item .MuiListItemText-primary {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      font-weight: 500 !important;
      color: rgba(255,255,255,0.45) !important;
      transition: color 0.2s ease;
    }
    .menu-item-default:hover .MuiListItemText-primary {
      color: rgba(255,255,255,0.75) !important;
    }
    .menu-item-active .MuiListItemText-primary {
      font-weight: 600 !important;
      color: rgba(255,255,255,0.9) !important;
    }

    /* ── Footer hint ── */
    .menu-footer {
      margin-top: auto;
      padding: 0 10px 4px;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.7rem !important;
      color: rgba(255,255,255,0.15) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const Menu = () => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();
  const location = useLocation();

  const listOfItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Emails", icon: Email, path: "/dashboard/emaillist" },
    { name: "Users", icon: SupervisedUserCircle, path: "/dashboard/userlist" },
    { name: "Technologies", icon: Biotech, path: "/dashboard/technologies" },
    { name: "Projects", icon: AccountTree, path: "/dashboard/projectlist" },
    { name: "Files", icon: FileUpload, path: "/dashboard/portfoliofilelist" },
    { name: "Tickets", icon: AirplaneTicket, path: "/dashboard/ticketlist" },
  ];
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="menu-shell">

      {/* ── Wordmark ── */}
      <Typography className="menu-wordmark">
        dev<span>.</span>folio
      </Typography>

      <div className="menu-divider" />

      {/* ── Nav label ── */}
      <Typography className="menu-section-label">Navigation</Typography>

      {/* ── Nav items ── */}
      <List disablePadding>
        {listOfItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <ListItem
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`menu-item ${isActive ? "menu-item-active" : "menu-item-default"}`}
            >
              <ListItemIcon
                className={isActive ? "menu-icon-active" : "menu-icon-default"}
              >
                <Icon sx={{ fontSize: "1.1rem" }} />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          );
        })}
      </List>

      {/* ── Footer ── */}
      <Typography className="menu-footer">
        Admin Panel
      </Typography>

    </Box>
  );
};

export default Menu;