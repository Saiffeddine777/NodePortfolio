import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import React, { useEffect } from "react";
import type { Technology } from "../../../Types/Technology.ts";
import { useLocation, useNavigate, type Location } from "react-router";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { api } from "../../../ApiService/ApiBrain.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "one-technology-v2-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

    /* ── Page ── */
    .ot2-page {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
      font-family: 'DM Sans', sans-serif;
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .ot2-col {
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back button ── */
    .ot2-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #818cf8;
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.28);
      border-radius: 999px;
      padding: 6px 16px;
      margin-bottom: 28px;
      cursor: pointer;
      transition: all 0.2s ease;
      align-self: flex-start;
    }
    .ot2-back:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .ot2-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      position: relative;
      overflow: hidden;
    }
    .ot2-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Header ── */
    .ot2-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 36px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      z-index: 1;
      position: relative;
    }

    .ot2-avatar {
      width: 96px !important;
      height: 96px !important;
      border: 2px solid rgba(99,102,241,0.35) !important;
      box-shadow: 0 0 28px rgba(99,102,241,0.2) !important;
      margin-bottom: 16px !important;
    }

    .ot2-name {
      font-family: 'DM Serif Display', serif !important;
      font-size: 1.55rem !important;
      color: #f1f5f9 !important;
      margin-bottom: 6px !important;
    }

    .ot2-type {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.5);
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      padding: 3px 10px;
    }

    /* ── Info ── */
    .ot2-info {
      padding: 24px 32px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .ot2-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ot2-label {
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.22);
    }

    .ot2-value {
      font-size: 0.88rem;
      color: rgba(255,255,255,0.65);
    }

    /* ── Badges ── */
    .ot2-id {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 6px;
      padding: 2px 8px;
      font-size: 0.72rem;
      color: rgba(255,255,255,0.25);
    }

    .ot2-score {
      color: #4ade80;
      background: rgba(74,222,128,0.08);
      border: 1px solid rgba(74,222,128,0.2);
      border-radius: 6px;
      padding: 3px 8px;
      font-weight: 700;
    }

    /* ── Actions ── */
    .ot2-actions {
      padding: 18px 32px;
      display: flex;
      justify-content: flex-end;
    }

    .ot2-edit {
      width: 34px !important;
      height: 34px !important;
      border-radius: 9px !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      background: rgba(255,255,255,0.03) !important;
      color: rgba(255,255,255,0.28) !important;
      transition: all 0.2s ease !important;
    }

    .ot2-edit:hover {
      color: #818cf8 !important;
      background: rgba(99,102,241,0.1) !important;
      border-color: rgba(99,102,241,0.35) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 0 14px rgba(99,102,241,0.2) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
function OneTechnology() {
  useEffect(() => { injectStyles(); }, []);

  const navigate = useNavigate();
  const location: Location<{ id?: number }> = useLocation();
  const [tech, setTech] = React.useState<Technology | null>(null);

  const handleFetchOneTech = async () => {
    try {
      const result: AxiosResponse<Technology> = await api.get(
        `/api/technologies/${location.state.id}`
      );
      setTech(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchOneTech();
  }, []);

  const navigateToSomething = (path: string, techId?: number) => {
    navigate(`/dashboard/${path}`, techId ? { state: { id: techId } } : undefined);
  };

  return (
    <Box className="ot2-page">
      <Box className="ot2-col">

        <button
          className="ot2-back"
          onClick={() => navigateToSomething("technologies")}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back to Technologies
        </button>

        <Box className="ot2-card">

          {/* Header */}
          <Box className="ot2-header">
            <Avatar
              src={tech?.logoUrl}
              alt={tech?.name}
              className="ot2-avatar"
            />
            <Typography className="ot2-name">{tech?.name}</Typography>
            <span className="ot2-type">{tech?.technologyType}</span>
          </Box>

          {/* Info */}
          <Box className="ot2-info">
            <Box className="ot2-row">
              <span className="ot2-label">Score</span>
              <span className="ot2-score">{tech?.score}</span>
            </Box>
            <Box className="ot2-row">
              <span className="ot2-label">Public ID</span>
              <span className="ot2-value">{tech?.publicId}</span>
            </Box>
            <Box className="ot2-row">
              <span className="ot2-label">ID</span>
              <span className="ot2-id">#{tech?.id}</span>
            </Box>
            <Box className="ot2-row">
              <span className="ot2-label">Created</span>
              <span className="ot2-value">
                {tech?.createdAt && new Date(tech.createdAt).toLocaleString()}
              </span>
            </Box>
            <Box className="ot2-row">
              <span className="ot2-label">Updated</span>
              <span className="ot2-value">
                {tech?.updatedAt && new Date(tech.updatedAt).toLocaleString()}
              </span>
            </Box>
          </Box>

          {/* Actions */}
          <Box className="ot2-actions">
            <IconButton
              className="ot2-edit"
              onClick={() =>
                navigateToSomething("modifytechnology", tech?.id)
              }
            >
              <EditIcon />
            </IconButton>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

export default OneTechnology;