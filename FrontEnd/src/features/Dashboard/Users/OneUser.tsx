import React, { useEffect } from "react";
import type { User } from "../../../Types/User.ts";
import { type AxiosResponse } from "axios";
import { useLocation, useNavigate, type Location } from "react-router";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import DeleteUser from "./DeleteUser.tsx";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { api } from "../../../ApiService/ApiBrain.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "one-user-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .ou-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Inner col ── */
    .ou-col {
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back button ── */
    .ou-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #818cf8;
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.28);
      border-radius: 999px;
      padding: 6px 16px;
      cursor: pointer;
      margin-bottom: 28px;
      align-self: flex-start;
      transition: color 0.2s ease, border-color 0.2s ease,
                  background 0.2s ease, transform 0.2s ease;
    }
    .ou-back-btn:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .ou-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .ou-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Avatar section ── */
    .ou-avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 36px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .ou-avatar {
      width: 96px !important;
      height: 96px !important;
      border: 2px solid rgba(99,102,241,0.35) !important;
      box-shadow: 0 0 28px rgba(99,102,241,0.2) !important;
      margin-bottom: 18px !important;
    }
    .ou-name {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.55rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      text-align: center !important;
      margin-bottom: 6px !important;
    }
    .ou-occupation {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.35) !important;
      text-align: center !important;
    }

    /* ── Info section ── */
    .ou-info-section {
      padding: 24px 32px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      gap: 14px;
      position: relative;
      z-index: 1;
    }
    .ou-info-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ou-info-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      width: 60px;
      flex-shrink: 0;
    }
    .ou-info-value {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      color: rgba(255,255,255,0.65) !important;
    }

    /* ── Role badge ── */
    .ou-role-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #818cf8;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 999px;
      padding: 3px 10px;
    }

    /* ── ID badge ── */
    .ou-id-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      color: rgba(255,255,255,0.25);
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 6px;
      padding: 2px 8px;
      letter-spacing: 0.04em;
    }

    /* ── Actions section ── */
    .ou-actions-section {
      padding: 18px 32px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      position: relative;
      z-index: 1;
    }

    /* ── Edit button ── */
    .ou-edit-btn {
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
    .ou-edit-btn:hover {
      color: #818cf8 !important;
      background: rgba(99,102,241,0.1) !important;
      border-color: rgba(99,102,241,0.35) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 0 14px rgba(99,102,241,0.2) !important;
    }
    .ou-edit-btn svg {
      font-size: 1rem !important;
    }

    /* ── Loading ── */
    .ou-loading {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      color: rgba(255,255,255,0.28) !important;
      text-align: center;
      padding: 64px 0 !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const OneUser = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();
  const location: Location<{ id?: number }> = useLocation();
  const id = location.state.id;
  const [user, setUser] = React.useState<Partial<User> | null>(null);

  const handleFetchOneUser: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<Partial<User>> = await api.get(
        `/api/users/${id}`
      );
      setUser(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToUsers: () => void = () => {
    navigate("/dashboard/userlist");
  };

  const navigateToModify: (id?: number) => void = (id) => {
    navigate("/dashboard/modifyuser", { state: { id } });
  };

  React.useEffect(() => {
    handleFetchOneUser();
  }, []);
  // ────────────────────────────────────────────────────────────────────────

  if (!user) {
    return (
      <Box className="ou-wrap">
        <Typography className="ou-loading">Loading user...</Typography>
      </Box>
    );
  }

  return (
    <Box className="ou-wrap">
      <Box className="ou-col">

        {/* ── Back button ── */}
        <button className="ou-back-btn" onClick={navigateToUsers}>
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back to Users
        </button>

        {/* ── Card ── */}
        <Box className="ou-card">

          {/* Avatar + name */}
          <Box className="ou-avatar-section">
            <Avatar
              src={user?.imageUrl}
              alt={user?.firstName}
              className="ou-avatar"
            />
            <Typography className="ou-name">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography className="ou-occupation">
              {user?.occupation}
            </Typography>
          </Box>

          {/* Info rows */}
          <Box className="ou-info-section">
            <Box className="ou-info-row">
              <Typography className="ou-info-label">Email</Typography>
              <Typography className="ou-info-value">{user?.email}</Typography>
            </Box>
            <Box className="ou-info-row">
              <Typography className="ou-info-label">Phone</Typography>
              <Typography className="ou-info-value">{user?.phoneNumber}</Typography>
            </Box>
            <Box className="ou-info-row">
              <Typography className="ou-info-label">Role</Typography>
              <span className="ou-role-badge">{user?.role}</span>
            </Box>
            <Box className="ou-info-row">
              <Typography className="ou-info-label">ID</Typography>
              <span className="ou-id-badge">#{user?.id}</span>
            </Box>
          </Box>

          {/* Actions */}
          <Box className="ou-actions-section">
            <DeleteUser id={user?.id} componentName={OneUser.name} />
            <IconButton
              className="ou-edit-btn"
              onClick={() => navigateToModify(user?.id)}
            >
              <EditIcon />
            </IconButton>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default OneUser;