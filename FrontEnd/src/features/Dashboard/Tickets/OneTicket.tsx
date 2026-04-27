import React, { useEffect } from "react";
import { api } from "../../../ApiService/ApiBrain.ts";
import { useLocation, type Location, useNavigate } from "react-router";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import type { Ticket } from "../../../Types/JiraProjects.ts";
import type { AxiosResponse } from "axios";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Skeleton,
  Button,
  Collapse,
  CircularProgress,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ReplyIcon from "@mui/icons-material/Reply";
import { MuiTextEditor } from "../../Components/MuiEditor.tsx";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "one-ticket-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .ot-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .ot-col {
      width: 100%;
      max-width: 760px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back button ── */
    .ot-back-btn {
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
    .ot-back-btn:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .ot-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .ot-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .ot-card-header {
      padding: 28px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .ot-issue-key-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .ot-issue-key {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.6rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
    }
    .ot-project-sub {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      color: rgba(255,255,255,0.28) !important;
      letter-spacing: 0.04em !important;
    }
    .ot-description {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      color: rgba(255,255,255,0.85) !important;
      line-height: 1.5 !important;
      margin-top: 14px !important;
    }

    /* ── Open in Jira icon btn ── */
    .ot-jira-btn {
      width: 32px !important;
      height: 32px !important;
      border-radius: 8px !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      background: rgba(255,255,255,0.03) !important;
      color: rgba(255,255,255,0.3) !important;
      transition: color 0.2s ease, border-color 0.2s ease,
                  background 0.2s ease !important;
    }
    .ot-jira-btn:hover {
      color: #818cf8 !important;
      border-color: rgba(99,102,241,0.35) !important;
      background: rgba(99,102,241,0.08) !important;
    }

    /* ── Card body ── */
    .ot-card-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
    }

    /* ── Divider ── */
    .ot-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 22px 0;
    }

    /* ── Section label ── */
    .ot-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      margin-bottom: 16px !important;
    }

    /* ── Meta row ── */
    .ot-meta-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .ot-meta-row {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    .ot-meta-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      min-width: 90px;
      padding-top: 2px;
      flex-shrink: 0;
    }
    .ot-meta-value {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.62) !important;
      flex: 1;
    }
    .ot-meta-value.muted {
      color: rgba(255,255,255,0.22) !important;
    }

    /* ── Status / type badges ── */
    .ot-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-radius: 6px;
      padding: 3px 10px;
    }
    .ot-badge-bug    { background: rgba(220,38,38,0.12);  color: #f87171; border: 1px solid rgba(220,38,38,0.25); }
    .ot-badge-task   { background: rgba(67,56,202,0.12);  color: #818cf8; border: 1px solid rgba(67,56,202,0.25); }
    .ot-badge-story  { background: rgba(21,128,61,0.12);  color: #4ade80; border: 1px solid rgba(21,128,61,0.25); }
    .ot-badge-epic   { background: rgba(124,58,237,0.12); color: #a78bfa; border: 1px solid rgba(124,58,237,0.25); }
    .ot-badge-default{ background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.1); }

    .ot-status-todo      { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.1); }
    .ot-status-progress  { background: rgba(251,191,36,0.1);  color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
    .ot-status-done      { background: rgba(74,222,128,0.1);  color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }

    /* ── ID monospace box ── */
    .ot-id-box {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      padding: 4px 10px 4px 12px;
      font-family: monospace;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.55);
      max-width: 100%;
      overflow: hidden;
    }
    .ot-id-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .ot-copy-btn {
      width: 24px !important;
      height: 24px !important;
      border-radius: 5px !important;
      color: rgba(255,255,255,0.3) !important;
      flex-shrink: 0;
      transition: color 0.18s ease !important;
    }
    .ot-copy-btn:hover {
      color: #818cf8 !important;
    }

    /* ── Reporter row ── */
    .ot-reporter-avatar {
      width: 28px !important;
      height: 28px !important;
      font-size: 0.7rem !important;
      border: 1px solid rgba(99,102,241,0.3) !important;
    }
    .ot-reporter-name {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      font-weight: 600 !important;
      color: rgba(255,255,255,0.75) !important;
    }
    .ot-reporter-email {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.3) !important;
    }

    /* ── Summary text ── */
    .ot-summary-text {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      color: rgba(255,255,255,0.55) !important;
      line-height: 1.8 !important;
      white-space: pre-wrap !important;
    }

    /* ── Email toggle button ── */
    .ot-emails-toggle {
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.76rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      border-radius: 999px !important;
      padding: 6px 16px !important;
      transition: all 0.2s ease !important;
    }
    .ot-emails-toggle.closed {
      color: rgba(255,255,255,0.5) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      background: transparent !important;
    }
    .ot-emails-toggle.closed:hover {
      border-color: rgba(99,102,241,0.35) !important;
      color: #818cf8 !important;
      background: rgba(99,102,241,0.06) !important;
    }
    .ot-emails-toggle.open {
      color: #818cf8 !important;
      border: 1px solid rgba(99,102,241,0.35) !important;
      background: rgba(99,102,241,0.1) !important;
    }

    /* ── Email count badge ── */
    .ot-email-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 18px;
      border-radius: 999px;
      background: rgba(99,102,241,0.2);
      border: 1px solid rgba(99,102,241,0.35);
      color: #818cf8;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0 5px;
    }

    /* ── Email card ── */
    .ot-email-card {
      border-radius: 14px !important;
      background: rgba(255,255,255,0.02) !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      overflow: hidden;
      transition: border-color 0.2s ease !important;
    }
    .ot-email-card:hover {
      border-color: rgba(99,102,241,0.2) !important;
    }
    .ot-email-card-inner {
      padding: 16px 20px;
    }
    .ot-email-subject {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      font-weight: 600 !important;
      color: rgba(255,255,255,0.8) !important;
      margin-bottom: 4px !important;
    }
    .ot-email-from {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.3) !important;
    }
    .ot-email-from strong {
      color: rgba(255,255,255,0.55);
    }
    .ot-email-body {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.42) !important;
      line-height: 1.75 !important;
      white-space: pre-wrap !important;
    }
    .ot-read-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-radius: 5px;
      padding: 2px 7px;
    }
    .ot-read-badge.read {
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.25);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .ot-read-badge.unread {
      background: rgba(99,102,241,0.12);
      color: #818cf8;
      border: 1px solid rgba(99,102,241,0.28);
    }
    .ot-email-date {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.7rem !important;
      color: rgba(255,255,255,0.2) !important;
    }
    .ot-email-divider {
      height: 1px;
      background: rgba(255,255,255,0.05);
      margin: 12px 0;
    }

    /* ── Action buttons ── */
    .ot-solve-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      background: linear-gradient(135deg, #16a34a, #4ade80) !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 7px 20px !important;
      border: none !important;
      box-shadow: 0 4px 16px rgba(74,222,128,0.25) !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .ot-solve-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 24px rgba(74,222,128,0.38) !important;
    }
    .ot-respond-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      color: #818cf8 !important;
      border: 1px solid rgba(99,102,241,0.3) !important;
      border-radius: 999px !important;
      padding: 7px 20px !important;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
    }
    .ot-respond-btn:hover {
      border-color: #818cf8 !important;
      background: rgba(99,102,241,0.1) !important;
      box-shadow: 0 0 16px rgba(99,102,241,0.2) !important;
    }
    .ot-cancel-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      color: #f87171 !important;
      border: 1px solid rgba(248,113,113,0.25) !important;
      border-radius: 999px !important;
      padding: 7px 20px !important;
      transition: border-color 0.2s, background 0.2s !important;
    }
    .ot-cancel-btn:hover {
      border-color: #f87171 !important;
      background: rgba(248,113,113,0.08) !important;
    }

    /* ── Footer buttons ── */
    .ot-open-jira-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.76rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 7px 20px !important;
      border: none !important;
      box-shadow: 0 4px 16px rgba(99,102,241,0.3) !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .ot-open-jira-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 24px rgba(99,102,241,0.45) !important;
    }
    .ot-back-footer-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.76rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 999px !important;
      padding: 7px 20px !important;
      transition: border-color 0.2s, color 0.2s, background 0.2s !important;
    }
    .ot-back-footer-btn:hover {
      border-color: rgba(255,255,255,0.25) !important;
      color: #fff !important;
      background: rgba(255,255,255,0.05) !important;
    }

    /* ── Loading ── */
    .ot-loading {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      color: rgba(255,255,255,0.28) !important;
      text-align: center;
      padding: 64px 0 !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const issueTypeColorMap: Record<string, string> = {
  Bug: "ot-badge-bug",
  Task: "ot-badge-task",
  Story: "ot-badge-story",
  Epic: "ot-badge-epic",
};
const statusColorMap: Record<string, string> = {
  "To Do": "ot-status-todo",
  "In Progress": "ot-status-progress",
  Done: "ot-status-done",
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const OneTicket = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const location: Location<{ id: string }> = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = React.useState<Partial<Ticket>>({});
  const [trigg, setTrigger] = React.useState<boolean>(false);
  const [responseEmail, setResponseEmail] = React.useState<string>("");
  const [textEditor, setTextEditor] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false);
  const [emailsOpen, setEmailsOpen] = React.useState(false);

  const makeTextEditorVisible = () => { setTextEditor(!textEditor); };

  const handleFetchingTicket: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<Ticket> = await api.get(
        `/api/tickets/getonejiraticket/${location.state.id}`
      );
      setTicket(result.data);
    } catch (error) {
      handleComponentError(error);
    } finally {
      setLoading(false);
    }
  };

  const submitResponse: () => Promise<void> = async () => {
    try {
      setLoadingSubmit(true);
      const result: AxiosResponse = await api.put(
        `/api/tickets/solvejiraticket/${location.state.id}`,
        {
          status: "Done",
          jiraID: ticket.jiraID,
          responseEmail,
          user: ticket.user,
          description: ticket.description,
        }
      );
      handleSuccess("Success", result.data.message);
    } catch (error) {
      handleComponentError(error);
    } finally {
      setTrigger(!trigg);
      setLoadingSubmit(false);
      setResponseEmail("");
      setTextEditor(false);
    }
  };

  React.useEffect(() => {
    handleFetchingTicket();
  }, [trigg]);

  const t = ticket as Ticket;
  const initials = `${t.user?.firstName?.[0] ?? ""}${t.user?.lastName?.[0] ?? ""}`.toUpperCase();
  const emailCount = t.emails?.length ?? 0;
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="ot-wrap">
      <Box className="ot-col">

        {/* ── Back button ── */}
        <button className="ot-back-btn" onClick={() => navigate(-1)}>
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back
        </button>

        {/* ── Card ── */}
        <Box className="ot-card">

          {/* Header */}
          <Box className="ot-card-header">
            <Box className="ot-issue-key-row">
              {loading ? (
                <Skeleton width={160} height={32} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
              ) : (
                <Typography className="ot-issue-key">{t.issueKey}</Typography>
              )}
              <Tooltip title="Open in Jira">
                <IconButton
                  className="ot-jira-btn"
                  component="a"
                  href={t.issueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={loading}
                >
                  <OpenInNewRoundedIcon sx={{ fontSize: "0.95rem" }} />
                </IconButton>
              </Tooltip>
            </Box>

            {loading ? (
              <Skeleton width={180} height={18} sx={{ bgcolor: "rgba(255,255,255,0.06)", mb: 1 }} />
            ) : (
              <Typography className="ot-project-sub">
                {t.projectKey} · Ticket detail
              </Typography>
            )}

            {loading ? (
              <Skeleton width="70%" height={24} sx={{ bgcolor: "rgba(255,255,255,0.06)", mt: 1.5 }} />
            ) : (
              <Typography className="ot-description">{t.description}</Typography>
            )}
          </Box>

          {/* Body */}
          <Box className="ot-card-body">

            {/* ── Meta ── */}
            <Typography className="ot-section-label">Details</Typography>
            <Box className="ot-meta-grid">

              {/* Status */}
              <Box className="ot-meta-row">
                <Typography className="ot-meta-label">Status</Typography>
                {loading ? (
                  <Skeleton width={80} height={22} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ) : (
                  <span className={`ot-badge ${statusColorMap[t.status] ?? "ot-badge-default"}`}>
                    {t.status}
                  </span>
                )}
              </Box>

              {/* Issue type */}
              <Box className="ot-meta-row">
                <Typography className="ot-meta-label">Type</Typography>
                {loading ? (
                  <Skeleton width={80} height={22} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ) : (
                  <span className={`ot-badge ${issueTypeColorMap[t.issueType] ?? "ot-badge-default"}`}>
                    {t.issueType}
                  </span>
                )}
              </Box>

              {/* Project */}
              <Box className="ot-meta-row">
                <Typography className="ot-meta-label">Project</Typography>
                {loading ? (
                  <Skeleton width={80} height={22} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ) : (
                  <span className="ot-badge ot-badge-default">{t.projectKey}</span>
                )}
              </Box>

              {/* Ticket ID */}
              <Box className="ot-meta-row">
                <Typography className="ot-meta-label">Ticket ID</Typography>
                {loading ? (
                  <Skeleton width={200} height={28} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ) : (
                  <Box className="ot-id-box">
                    <span className="ot-id-text">{t.id}</span>
                    <Tooltip title="Copy ID">
                      <IconButton
                        className="ot-copy-btn"
                        size="small"
                        onClick={() => navigator.clipboard.writeText(t.id)}
                      >
                        <ContentCopyRoundedIcon sx={{ fontSize: "0.85rem" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>

              {/* Priority */}
              <Box className="ot-meta-row">
                <Typography className="ot-meta-label">Priority</Typography>
                {loading ? (
                  <Skeleton width={80} height={20} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ) : (
                  <Typography className={`ot-meta-value ${!t.priority ? "muted" : ""}`}>
                    {t.priority ?? "Not set"}
                  </Typography>
                )}
              </Box>

              {/* Assignee */}
              <Box className="ot-meta-row">
                <Typography className="ot-meta-label">Assignee</Typography>
                {loading ? (
                  <Skeleton width={100} height={20} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ) : (
                  <Typography className={`ot-meta-value ${!t.assigneeName ? "muted" : ""}`}>
                    {t.assigneeName ?? "Unassigned"}
                  </Typography>
                )}
              </Box>

              {/* Reporter */}
              <Box className="ot-meta-row">
                <Typography className="ot-meta-label">Reporter</Typography>
                {loading ? (
                  <Skeleton width={160} height={28} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ) : t.user ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      src={t.user?.imageUrl as string}
                      alt={t.user?.firstName as string}
                      className="ot-reporter-avatar"
                    >
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography className="ot-reporter-name">
                        {t.user?.firstName} {t.user?.lastName}
                      </Typography>
                      <Typography className="ot-reporter-email">
                        {t.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography className="ot-meta-value muted">Unknown</Typography>
                )}
              </Box>

              {/* Created */}
              <Box className="ot-meta-row">
                <Typography className="ot-meta-label">Created</Typography>
                {loading ? (
                  <Skeleton width={100} height={20} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ) : (
                  <Typography className="ot-meta-value">
                    {new Date(t.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </Typography>
                )}
              </Box>

              {/* Updated */}
              <Box className="ot-meta-row">
                <Typography className="ot-meta-label">Updated</Typography>
                {loading ? (
                  <Skeleton width={100} height={20} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ) : (
                  <Typography className="ot-meta-value">
                    {new Date(t.updatedAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </Typography>
                )}
              </Box>

            </Box>

            <div className="ot-divider" />

            {/* ── Summary ── */}
            <Typography className="ot-section-label">Summary</Typography>
            {loading ? (
              <Box>
                <Skeleton width="100%" height={20} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                <Skeleton width="75%" height={20} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
              </Box>
            ) : (
              <Typography className="ot-summary-text">
                {t.summary ?? "No summary provided."}
              </Typography>
            )}

            <div className="ot-divider" />

            {/* ── Email exchange ── */}
            <Typography className="ot-section-label">Email Exchange</Typography>

            <Button
              className={`ot-emails-toggle ${emailsOpen ? "open" : "closed"}`}
              disabled={loading || emailCount === 0}
              onClick={() => setEmailsOpen((prev) => !prev)}
              startIcon={<MailOutlineRoundedIcon sx={{ fontSize: "0.9rem !important" }} />}
              endIcon={
                emailsOpen
                  ? <ExpandLessRoundedIcon sx={{ fontSize: "0.9rem !important" }} />
                  : <ExpandMoreRoundedIcon sx={{ fontSize: "0.9rem !important" }} />
              }
            >
              {emailCount === 0
                ? "No emails"
                : `${emailCount} email${emailCount !== 1 ? "s" : ""}`}
              {emailCount > 0 && !emailsOpen && (
                <span className="ot-email-count">{emailCount}</span>
              )}
            </Button>

            <Collapse in={emailsOpen}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                {t.emails?.map((email) => (
                  <Box key={email.id} className="ot-email-card">
                    <Box className="ot-email-card-inner">

                      {/* Email header */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1 }}>
                        <Box>
                          <Typography className="ot-email-subject">{email.subject}</Typography>
                          <Typography className="ot-email-from">
                            From <strong>{email.fromName}</strong> · {email.fromEmail}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                          <span className={`ot-read-badge ${email.isRead ? "read" : "unread"}`}>
                            {email.isRead ? "Read" : "Unread"}
                          </span>
                          <Typography className="ot-email-date">
                            {new Date(email.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </Typography>
                        </Box>
                      </Box>

                      <div className="ot-email-divider" />

                      <Typography className="ot-email-body">{email.body}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Text editor */}
              {textEditor && (
                <Box sx={{ mt: 2, mb: 1 }}>
                  <MuiTextEditor onChange={setResponseEmail} />
                </Box>
              )}

              {/* Reply actions */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 2 }}>
                {responseEmail !== "" && (
                  <Button
                    className="ot-solve-btn"
                    disabled={loadingSubmit}
                    startIcon={
                      loadingSubmit
                        ? <CircularProgress size={14} color="inherit" />
                        : <SendIcon sx={{ fontSize: "0.9rem !important" }} />
                    }
                    onClick={submitResponse}
                    variant="contained"
                    disableElevation
                  >
                    {loadingSubmit ? "Solving..." : "Solve"}
                  </Button>
                )}
                <Button
                  className={textEditor ? "ot-cancel-btn" : "ot-respond-btn"}
                  startIcon={
                    textEditor
                      ? <CloseIcon sx={{ fontSize: "0.9rem !important" }} />
                      : <ReplyIcon sx={{ fontSize: "0.9rem !important" }} />
                  }
                  onClick={makeTextEditorVisible}
                  variant="outlined"
                  disableElevation
                >
                  {textEditor ? "Cancel" : "Respond"}
                </Button>
              </Box>
            </Collapse>

            <div className="ot-divider" />

            {/* ── Footer actions ── */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                className="ot-open-jira-btn"
                component="a"
                href={t.issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                disabled={loading}
                variant="contained"
                disableElevation
              >
                Open in Jira
              </Button>
              <Button
                className="ot-back-footer-btn"
                onClick={() => navigate(-1)}
                variant="outlined"
                disableElevation
              >
                Back
              </Button>
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OneTicket;