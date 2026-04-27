import React, { useEffect } from "react";
import {
  useLocation,
  useNavigate,
  type Location,
  type NavigateFunction,
} from "react-router";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import type { AxiosResponse } from "axios";
import { api } from "../../ApiService/ApiBrain.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import type { JiraIssue } from "../../Types/JiraProjects.ts";
import { useAppSelector } from "../../app/Hooks.ts";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import { handleInputChangeIntoARefObject } from "../../Helpers/FieldVerifier.ts";
import BackToHome from "../HomeComponents/BackToHome.tsx";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "create-issue-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Page (always dark) ── */
    .ci-page {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 20px 80px;
    }

    /* ── Inner col ── */
    .ci-col {
      width: 100%;
      max-width: 580px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back row ── */
    .ci-back-row {
      margin-bottom: 28px;
      align-self: flex-start;
    }

    /* ── Card ── */
    .ci-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .ci-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .ci-card-header {
      padding: 28px 32px 22px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .ci-header-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .ci-header-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.22);
      color: #818cf8;
      flex-shrink: 0;
    }
    .ci-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.6rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
    }
    .ci-subtitle-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .ci-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.3) !important;
    }
    .ci-project-key {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #818cf8;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 6px;
      padding: 2px 9px;
    }

    /* ── Form body ── */
    .ci-form-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    /* ── Section label ── */
    .ci-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      margin-bottom: 4px !important;
    }

    /* ── Divider ── */
    .ci-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 2px 0;
    }

    /* ── Select ── */
    .ci-select {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      color: rgba(255,255,255,0.82) !important;
    }
    .ci-select .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255,255,255,0.1) !important;
    }
    .ci-select:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255,255,255,0.22) !important;
    }
    .ci-select.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #818cf8 !important;
    }
    .ci-select .MuiSvgIcon-root {
      color: rgba(255,255,255,0.3) !important;
    }
    .ci-select-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .ci-select-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Issue type badges ── */
    .ci-type-chip {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-radius: 6px;
      padding: 3px 10px;
    }
    .ci-type-Bug        { background: rgba(220,38,38,0.12);  color: #f87171; border: 1px solid rgba(220,38,38,0.25); }
    .ci-type-Task       { background: rgba(67,56,202,0.12);  color: #818cf8; border: 1px solid rgba(67,56,202,0.25); }
    .ci-type-Story      { background: rgba(21,128,61,0.12);  color: #4ade80; border: 1px solid rgba(21,128,61,0.25); }
    .ci-type-Epic       { background: rgba(124,58,237,0.12); color: #a78bfa; border: 1px solid rgba(124,58,237,0.25); }
    .ci-type-Subtask    { background: rgba(3,105,161,0.12);  color: #38bdf8; border: 1px solid rgba(3,105,161,0.25); }
    .ci-type-default    { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.1); }

    /* ── MenuItem ── */
    .ci-menu-item {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
    }

    /* ── Textarea / TextField ── */
    .ci-textfield .MuiOutlinedInput-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      color: rgba(255,255,255,0.82) !important;
      background: rgba(255,255,255,0.025) !important;
      border-radius: 12px !important;
    }
    .ci-textfield .MuiOutlinedInput-root fieldset {
      border-color: rgba(255,255,255,0.1) !important;
      transition: border-color 0.2s ease;
    }
    .ci-textfield .MuiOutlinedInput-root:hover fieldset {
      border-color: rgba(255,255,255,0.22) !important;
    }
    .ci-textfield .MuiOutlinedInput-root.Mui-focused fieldset {
      border-color: #818cf8 !important;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    }
    .ci-textfield .MuiInputLabel-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.35) !important;
    }
    .ci-textfield .MuiInputLabel-root.Mui-focused {
      color: #818cf8 !important;
    }
    .ci-textfield .MuiOutlinedInput-root textarea,
    .ci-textfield .MuiOutlinedInput-root input {
      color: rgba(255,255,255,0.82) !important;
    }

    /* ── Submit button ── */
    .ci-submit-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 9px 0 !important;
      border: none !important;
      box-shadow: 0 4px 18px rgba(99,102,241,0.35) !important;
      flex: 1;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .ci-submit-btn:hover:not(:disabled) {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 26px rgba(99,102,241,0.5) !important;
    }
    .ci-submit-btn:disabled {
      opacity: 0.6 !important;
    }

    /* ── Cancel button ── */
    .ci-cancel-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.4) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 999px !important;
      padding: 9px 0 !important;
      flex: 1;
      transition: color 0.2s ease, border-color 0.2s ease,
                  background 0.2s ease !important;
    }
    .ci-cancel-btn:hover:not(:disabled) {
      color: #fff !important;
      border-color: rgba(255,255,255,0.25) !important;
      background: rgba(255,255,255,0.05) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const ISSUE_TYPES = ["Bug", "Task", "Story", "Epic", "Subtask"];
const getTypeCls = (type: string) =>
  `ci-type-chip ci-type-${type}` || "ci-type-chip ci-type-default";

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

function CreateAnIssue({}: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const authenticatedUser = useAppSelector((state) => state.userAuth.authUser);
  const location: Location<{ key: string }> = useLocation();
  const key = location.state.key;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const navigate: NavigateFunction = useNavigate();

  const issueRef = React.useRef<JiraIssue>({
    userId: authenticatedUser?.id,
    keyProject: key,
    summary: "",
    description: "",
    name: "",
  });

  const handlePostAnIssue: () => Promise<void> = async () => {
    setLoading(true);
    try {
      const issueResult: AxiosResponse = await api.post(
        `/api/tickets/createjiraticket`,
        issueRef.current
      );
      if (issueResult.data.message) {
        handleSuccess("Success", issueResult.data.message);
      }
    } catch (error) {
      handleComponentError(error);
    } finally {
      setLoading(false);
      navigate("/");
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="ci-page">
      <Box className="ci-col">

        {/* ── Back button ── */}
        <Box className="ci-back-row">
          <BackToHome />
        </Box>

        {/* ── Card ── */}
        <Box className="ci-card">

          {/* Header */}
          <Box className="ci-card-header">
            <Box className="ci-header-row">
              <Box className="ci-header-icon">
                <BugReportRoundedIcon sx={{ fontSize: "1.1rem" }} />
              </Box>
              <Typography className="ci-title">Create an Issue</Typography>
            </Box>
            <Box className="ci-subtitle-row">
              <Typography className="ci-subtitle">
                Filing against project
              </Typography>
              <span className="ci-project-key">{key}</span>
            </Box>
          </Box>

          {/* Form */}
          <Box className="ci-form-body">

            <Typography className="ci-section-label">Issue Type</Typography>

            {/* Type select */}
            <FormControl fullWidth size="small">
              <InputLabel className="ci-select-label">Issue Type</InputLabel>
              <Select
                className="ci-select"
                label="Issue Type"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  handleInputChangeIntoARefObject(issueRef, e as any, "name");
                }}
                renderValue={(value) => (
                  <span className={getTypeCls(value)}>{value}</span>
                )}
              >
                {ISSUE_TYPES.map((type) => (
                  <MenuItem key={type} value={type} className="ci-menu-item">
                    <span className={getTypeCls(type)}>{type}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="ci-divider" />

            <Typography className="ci-section-label">Details</Typography>

            {/* Description */}
            <TextField
              className="ci-textfield"
              label="Description"
              placeholder="e.g. Submit button unresponsive on sign-in page"
              fullWidth
              size="small"
              onChange={(e) =>
                handleInputChangeIntoARefObject(issueRef, e, "description")
              }
            />

            {/* Summary */}
            <TextField
              className="ci-textfield"
              label="Summary"
              placeholder="Steps to reproduce, expected vs actual behavior, environment details…"
              multiline
              rows={5}
              fullWidth
              size="small"
              onChange={(e) =>
                handleInputChangeIntoARefObject(issueRef, e, "summary")
              }
            />

            <div className="ci-divider" />

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                className="ci-submit-btn"
                variant="contained"
                disabled={loading}
                onClick={handlePostAnIssue}
                disableElevation
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={13} thickness={5} sx={{ color: "inherit" }} />
                    Submitting…
                  </Box>
                ) : (
                  "Submit Issue"
                )}
              </Button>
              <Button
                className="ci-cancel-btn"
                variant="outlined"
                disabled={loading}
                onClick={() => window.history.back()}
                disableElevation
              >
                Cancel
              </Button>
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateAnIssue;