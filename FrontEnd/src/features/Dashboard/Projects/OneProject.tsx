import React, { useEffect } from "react";
import type { Project } from "../../../Types/Project.ts";
import type { AxiosResponse } from "axios";
import {
  useLocation,
  useNavigate,
  type Location,
  type NavigateFunction,
} from "react-router";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { Box, Typography, Button } from "@mui/material";
import { api } from "../../../ApiService/ApiBrain.ts";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "one-project-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .op-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Inner col ── */
    .op-col {
      width: 100%;
      max-width: 720px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back button ── */
    .op-back-btn {
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
    .op-back-btn:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .op-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .op-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
      z-index: 0;
    }

    /* ── Image ── */
    .op-img-wrap {
      position: relative;
      height: 280px;
      overflow: hidden;
    }
    .op-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }
    .op-card:hover .op-img-wrap img {
      transform: scale(1.03);
    }
    .op-img-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 40%, rgba(11,12,16,0.75) 100%);
      pointer-events: none;
    }

    /* ── Card body ── */
    .op-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
    }

    /* ── Tag ── */
    .op-tag {
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

    /* ── Title ── */
    .op-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: clamp(1.5rem, 3vw, 2rem) !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 14px !important;
    }

    /* ── Description ── */
    .op-desc {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.9rem !important;
      color: rgba(255,255,255,0.48) !important;
      line-height: 1.8 !important;
    }

    /* ── Divider ── */
    .op-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 24px 0;
    }

    /* ── Section label ── */
    .op-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      margin-bottom: 12px !important;
    }

    /* ── Tech chips row ── */
    .op-chips-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }
    .op-tech-chip {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #818cf8;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 8px;
      padding: 4px 12px;
      transition: background 0.18s ease, border-color 0.18s ease;
    }
    .op-tech-chip:hover {
      background: rgba(99,102,241,0.18);
      border-color: rgba(99,102,241,0.45);
    }

    /* ── Links row ── */
    .op-links-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    /* ── GitHub button ── */
    .op-btn-github {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.65) !important;
      border: 1px solid rgba(255,255,255,0.12) !important;
      border-radius: 999px !important;
      padding: 7px 22px !important;
      transition: border-color 0.2s, color 0.2s, background 0.2s !important;
    }
    .op-btn-github:hover {
      border-color: rgba(255,255,255,0.3) !important;
      color: #fff !important;
      background: rgba(255,255,255,0.06) !important;
    }

    /* ── Live button ── */
    .op-btn-live {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase !important;
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 7px 22px !important;
      border: none !important;
      box-shadow: 0 4px 18px rgba(99,102,241,0.35) !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .op-btn-live:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 26px rgba(99,102,241,0.5) !important;
    }

    /* ── Loading ── */
    .op-loading {
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

function OneProject({}: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const location: Location<{ id?: number }> = useLocation();
  const [project, setProject] = React.useState<Project | null>(null);
  const navigate: NavigateFunction = useNavigate();

  const handleFetchProject: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<Project> = await api.get(
        `/api/projects/${location.state.id}`
      );
      setProject(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchProject();
  }, []);

  const navigateToProjects: () => void = () => {
    navigate("/dashboard/projectlist");
  };
  // ────────────────────────────────────────────────────────────────────────

  if (!project) {
    return (
      <Box className="op-wrap">
        <Typography className="op-loading">Loading project...</Typography>
      </Box>
    );
  }

  return (
    <Box className="op-wrap">
      <Box className="op-col">

        {/* ── Back button ── */}
        <button className="op-back-btn" onClick={navigateToProjects}>
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back to Projects
        </button>

        {/* ── Card ── */}
        <Box className="op-card">

          {/* Image */}
          {project.imageUrl && (
            <Box className="op-img-wrap">
              <img src={project.imageUrl} alt={project.projectName} />
            </Box>
          )}

          {/* Body */}
          <Box className="op-body">

            <div className="op-tag">Project</div>
            <Typography className="op-title">{project.projectName}</Typography>
            <Typography className="op-desc">{project.description}</Typography>

            <div className="op-divider" />

            {/* Tech stack */}
            <Typography className="op-section-label">Tech Stack</Typography>
            <div className="op-chips-row">
              {project.techStack.map((tech) => (
                <span key={tech} className="op-tech-chip">{tech}</span>
              ))}
            </div>

            {/* Links */}
            <Typography className="op-section-label">Links</Typography>
            <div className="op-links-row">
              {project.githubUrl && (
                <Button
                  className="op-btn-github"
                  component="a"
                  href={project.githubUrl}
                  target="_blank"
                  disableElevation
                  disableRipple={false}
                >
                  GitHub
                </Button>
              )}
              {project.liveUrl && (
                <Button
                  className="op-btn-live"
                  component="a"
                  href={project.liveUrl}
                  target="_blank"
                  variant="contained"
                  disableElevation
                >
                  Live Demo
                </Button>
              )}
            </div>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default OneProject;