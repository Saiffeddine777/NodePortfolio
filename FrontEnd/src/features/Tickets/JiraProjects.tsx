import React, { useEffect } from "react";
import {
  Box,
  Avatar,
  InputBase,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { api } from "../../ApiService/ApiBrain.ts";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { type JiraProject } from "../../Types/JiraProjects.ts";
import { useNavigate, type NavigateFunction } from "react-router";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "jira-projects-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Standalone page background ── */
    .jp-page {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
    }
    /* ── Wrapper ── */
    .jp-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      max-width: 1100px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .jp-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
    }
    .jp-tag {
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
      margin-bottom: 12px;
    }
    .jp-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 4px !important;
    }
    .jp-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.28) !important;
    }

    /* ── Search + refresh row ── */
    .jp-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }
    .jp-search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 999px;
      padding: 7px 16px;
      width: 240px;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .jp-search-box:focus-within {
      border-color: rgba(99,102,241,0.4);
      background: rgba(99,102,241,0.05);
    }
    .jp-search-icon {
      color: rgba(255,255,255,0.25) !important;
      font-size: 1rem !important;
      flex-shrink: 0;
    }
    .jp-search-input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.7) !important;
      flex: 1;
    }
    .jp-search-input input::placeholder {
      color: rgba(255,255,255,0.22) !important;
    }
    .jp-refresh-btn {
      width: 36px !important;
      height: 36px !important;
      border-radius: 10px !important;
      border: 1px solid rgba(255,255,255,0.09) !important;
      background: rgba(255,255,255,0.03) !important;
      color: rgba(255,255,255,0.35) !important;
      transition: color 0.2s ease, border-color 0.2s ease,
                  background 0.2s ease, transform 0.2s ease !important;
    }
    .jp-refresh-btn:hover {
      color: #818cf8 !important;
      border-color: rgba(99,102,241,0.35) !important;
      background: rgba(99,102,241,0.08) !important;
      transform: rotate(45deg) !important;
    }
    .jp-refresh-btn svg {
      font-size: 1rem !important;
    }

    /* ── Divider ── */
    .jp-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 0 0 28px;
    }

    /* ── Grid ── */
    .jp-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    @media (max-width: 900px) { .jp-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) { .jp-grid { grid-template-columns: 1fr; } }

    /* ── Card ── */
    .jp-card {
      border-radius: 18px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
      transition: border-color 0.22s ease, transform 0.22s ease,
                  box-shadow 0.22s ease;
    }
    .jp-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.05) 0%, transparent 60%);
      pointer-events: none;
    }
    .jp-card:hover {
      border-color: rgba(99,102,241,0.3);
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.3);
    }

    /* ── Card inner ── */
    .jp-card-inner {
      padding: 22px 22px 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    /* ── Avatar row ── */
    .jp-avatar-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .jp-avatar {
      width: 42px !important;
      height: 42px !important;
      border-radius: 10px !important;
      border: 1px solid rgba(99,102,241,0.2) !important;
      flex-shrink: 0;
    }
    .jp-project-name {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.93rem !important;
      font-weight: 700 !important;
      color: rgba(255,255,255,0.88) !important;
      letter-spacing: -0.01em !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .jp-project-key {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      font-weight: 600 !important;
      color: rgba(255,255,255,0.28) !important;
      letter-spacing: 0.06em !important;
    }
    .jp-open-btn {
      width: 28px !important;
      height: 28px !important;
      border-radius: 7px !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      background: rgba(255,255,255,0.03) !important;
      color: rgba(255,255,255,0.25) !important;
      margin-left: auto;
      flex-shrink: 0;
      transition: color 0.2s ease, border-color 0.2s ease,
                  background 0.2s ease !important;
    }
    .jp-open-btn:hover {
      color: #818cf8 !important;
      border-color: rgba(99,102,241,0.35) !important;
      background: rgba(99,102,241,0.08) !important;
    }
    .jp-open-btn svg {
      font-size: 0.82rem !important;
    }

    /* ── Card divider ── */
    .jp-card-divider {
      height: 1px;
      background: rgba(255,255,255,0.06);
    }

    /* ── Badges row ── */
    .jp-badges-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .jp-type-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: capitalize;
      border-radius: 6px;
      padding: 3px 9px;
    }
    .jp-type-software { background: rgba(67,56,202,0.12); color: #818cf8; border: 1px solid rgba(67,56,202,0.25); }
    .jp-type-business { background: rgba(3,105,161,0.12); color: #38bdf8; border: 1px solid rgba(3,105,161,0.25); }
    .jp-type-service_desk { background: rgba(21,128,61,0.12); color: #4ade80; border: 1px solid rgba(21,128,61,0.25); }
    .jp-type-ops { background: rgba(161,98,7,0.12); color: #fbbf24; border: 1px solid rgba(161,98,7,0.25); }
    .jp-type-default { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.09); }

    .jp-style-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: capitalize;
      border-radius: 6px;
      padding: 3px 9px;
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.35);
      border: 1px solid rgba(255,255,255,0.08);
    }

    .jp-privacy-icon {
      margin-left: auto;
      display: flex;
      align-items: center;
    }
    .jp-privacy-icon.private { color: #fbbf24; }
    .jp-privacy-icon.public  { color: #4ade80; }
    .jp-privacy-icon svg { font-size: 0.95rem !important; }

    /* ── Action button ── */
    .jp-action-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.74rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 7px 0 !important;
      border: none !important;
      box-shadow: 0 4px 16px rgba(99,102,241,0.3) !important;
      width: 100% !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .jp-action-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 24px rgba(99,102,241,0.45) !important;
    }

    /* ── Skeleton cards ── */
    .jp-skeleton-card {
      border-radius: 18px;
      background: rgba(255,255,255,0.028);
      border: 1px solid rgba(255,255,255,0.06);
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    /* ── Empty state ── */
    .jp-empty {
      text-align: center;
      padding: 64px 0;
    }
    .jp-empty-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.3rem !important;
      font-weight: 400 !important;
      color: rgba(255,255,255,0.35) !important;
      margin-bottom: 8px !important;
    }
    .jp-empty-sub {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.2) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const getTypeCls = (type: string) => {
  const map: Record<string, string> = {
    software: "jp-type-software",
    business: "jp-type-business",
    service_desk: "jp-type-service_desk",
    ops: "jp-type-ops",
  };
  return map[type?.toLowerCase()] ?? "jp-type-default";
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const JiraProjects = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const [jiraProjects, setJiraProjects] = React.useState<JiraProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const navigate: NavigateFunction = useNavigate();

  const handleNavigateToJiraComponent = (param: string, key: string) => {
    switch (param) {
      case "createanissue":
        navigate("/createanissue", { state: { key } });
        break;
      case "suggestafeature":
        navigate("/suggestafeature", { state: { key } });
        break;
    }
  };

  const handleFetchingJiraProjects = async () => {
    setLoading(true);
    try {
      const projects = await api.get(`/api/tickets/getjiraprojects`);
      const data = projects.data;
      setJiraProjects(Array.isArray(data) ? data : Object.values(data));
    } catch (error) {
      handleComponentError(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { handleFetchingJiraProjects(); }, []);

  const filtered = jiraProjects.filter((p) =>
    [p.name, p.key, p.projectTypeKey]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="jp-page">
    <Box className="jp-wrap">

      {/* ── Header ── */}
      <Box className="jp-header">
        <Box>
          <div className="jp-tag">Jira</div>
          <Typography className="jp-title">Projects</Typography>
          <Typography className="jp-subtitle">
            {loading
              ? "Loading projects..."
              : `${filtered.length} project${filtered.length !== 1 ? "s" : ""} found`}
          </Typography>
        </Box>

        {/* Controls */}
        <Box className="jp-controls">
          <Box className="jp-search-box">
            <SearchRoundedIcon className="jp-search-icon" />
            <InputBase
              className="jp-search-input"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Tooltip title="Refresh">
            <IconButton
              className="jp-refresh-btn"
              onClick={handleFetchingJiraProjects}
            >
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <div className="jp-divider" />

      {/* ── Grid ── */}
      <Box className="jp-grid">

        {/* Skeleton loading */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} className="jp-skeleton-card">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Skeleton
                  variant="rounded"
                  width={42}
                  height={42}
                  sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: "10px" }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="65%" height={18} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                  <Skeleton width="35%" height={14} sx={{ bgcolor: "rgba(255,255,255,0.04)", mt: 0.5 }} />
                </Box>
              </Box>
              <Skeleton width="45%" height={22} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "6px" }} />
              <Skeleton width="100%" height={34} sx={{ bgcolor: "rgba(99,102,241,0.08)", borderRadius: "999px" }} />
            </Box>
          ))}

        {/* Project cards */}
        {!loading &&
          filtered.map((project) => (
            <Box key={project.id} className="jp-card">
              <Box className="jp-card-inner">

                {/* Avatar + name */}
                <Box className="jp-avatar-row">
                  <Avatar
                    src={project.avatarUrls?.["48x48"]}
                    alt={project.name}
                    variant="rounded"
                    className="jp-avatar"
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography className="jp-project-name">{project.name}</Typography>
                    <Typography className="jp-project-key">{project.key}</Typography>
                  </Box>
                  <Tooltip title="Open in Jira">
                    <IconButton
                      className="jp-open-btn"
                      component="a"
                      href={`https://saiffeddinezouaghi.atlassian.net/jira/software/projects/${project.key}/boards/1`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <div className="jp-card-divider" />

                {/* Badges */}
                <Box className="jp-badges-row">
                  <span className={`jp-type-badge ${getTypeCls(project.projectTypeKey)}`}>
                    {project.projectTypeKey}
                  </span>
                  <span className="jp-style-badge">{project.style}</span>
                  <Tooltip title={project.isPrivate ? "Private" : "Public"}>
                    <Box className={`jp-privacy-icon ${project.isPrivate ? "private" : "public"}`}>
                      {project.isPrivate
                        ? <LockRoundedIcon />
                        : <PublicRoundedIcon />}
                    </Box>
                  </Tooltip>
                </Box>

                {/* Action */}
                <Button
                  className="jp-action-btn"
                  onClick={() => handleNavigateToJiraComponent("createanissue", project.key)}
                  variant="contained"
                  disableElevation
                >
                  Create an Issue
                </Button>

              </Box>
            </Box>
          ))}
      </Box>

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <Box className="jp-empty">
          <Typography className="jp-empty-title">No projects found</Typography>
          <Typography className="jp-empty-sub">
            Try adjusting your search query.
          </Typography>
        </Box>
      )}

    </Box>
    </Box>
  );
};

export default JiraProjects;