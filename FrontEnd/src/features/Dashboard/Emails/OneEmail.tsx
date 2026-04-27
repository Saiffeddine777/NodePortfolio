import React, { useEffect } from "react";
import { type AxiosResponse } from "axios";
import { useLocation, useNavigate, type Location } from "react-router";
import { Box, Typography } from "@mui/material";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import type { EmailInterface } from "../../../Types/EmailType.ts";
import { api } from "../../../ApiService/ApiBrain.ts";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "one-email-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .oe-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Inner max-width col ── */
    .oe-col {
      width: 100%;
      max-width: 620px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* ── Back button ── */
    .oe-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: none;
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
    .oe-back-btn:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .oe-card {
      border-radius: 18px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .oe-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .oe-card-header {
      padding: 28px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .oe-tag {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #818cf8;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 999px;
      padding: 3px 12px;
      margin-bottom: 14px;
    }
    .oe-subject {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: clamp(1.3rem, 3vw, 1.7rem) !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.25 !important;
      margin-bottom: 0 !important;
    }

    /* ── Meta strip ── */
    .oe-meta-strip {
      padding: 20px 32px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: rgba(255,255,255,0.015);
    }
    .oe-meta-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .oe-meta-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      width: 68px;
      flex-shrink: 0;
    }
    .oe-meta-value {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.84rem !important;
      color: rgba(255,255,255,0.62) !important;
    }
    .oe-meta-value strong {
      color: rgba(255,255,255,0.85);
      font-weight: 600;
    }
    .oe-meta-value em {
      color: rgba(255,255,255,0.38);
      font-style: normal;
    }

    /* ── Body ── */
    .oe-body {
      padding: 28px 32px 32px;
    }
    .oe-body-text {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.6) !important;
      line-height: 1.85 !important;
      white-space: pre-line !important;
    }

    /* ── Loading ── */
    .oe-loading {
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

function OneEmail({}: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();
  const location: Location<{ id: number }> = useLocation();
  const [email, setEmail] = React.useState<EmailInterface | null>(null);

  const handleFetchEmail: () => Promise<void> = async () => {
    try {
      const response: AxiosResponse<EmailInterface> = await api.get(
        `/api/emails/${location.state.id}`
      );
      setEmail(response.data);
      if (!response.data.isRead) {
        await api.put(`/api/emails/${location.state.id}`);
      }
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchEmail();
  }, []);

  const navigateBackToEmails: () => void = () => {
    navigate("/dashboard/emaillist");
  };
  // ────────────────────────────────────────────────────────────────────────

  if (!email) {
    return (
      <Box className="oe-wrap">
        <Typography className="oe-loading">Loading email...</Typography>
      </Box>
    );
  }

  return (
    <Box className="oe-wrap">
      <Box className="oe-col">

        {/* ── Back button ── */}
        <button className="oe-back-btn" onClick={navigateBackToEmails}>
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back to List
        </button>

        {/* ── Card ── */}
        <Box className="oe-card">

          {/* Header */}
          <Box className="oe-card-header">
            <div className="oe-tag">Message</div>
            <Typography className="oe-subject">{email.subject}</Typography>
          </Box>

          {/* Meta */}
          <Box className="oe-meta-strip">
            <Box className="oe-meta-row">
              <Typography className="oe-meta-label">From</Typography>
              <Typography className="oe-meta-value">
                <strong>{email.fromName}</strong>{" "}
                <em>({email.fromEmail})</em>
              </Typography>
            </Box>
            <Box className="oe-meta-row">
              <Typography className="oe-meta-label">Received</Typography>
              <Typography className="oe-meta-value">
                {new Date(email.createdAt as Date).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Body */}
          <Box className="oe-body">
            <Typography className="oe-body-text">{email.body}</Typography>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

export default OneEmail;