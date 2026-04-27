import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import { type Project } from "../../Types/Project.ts";
import { useNavigate, type NavigateFunction } from "react-router";
import React from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "projects-section-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Section heading ── */
    .ps-section-tag {
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
      margin-bottom: 16px;
    }
    .ps-section-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: clamp(1.6rem, 4vw, 2.2rem) !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 8px !important;
    }
    .ps-section-sub {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.4) !important;
      margin-bottom: 0 !important;
    }

    /* ── Card ── */
    .ps-card {
      position: relative;
      background: rgba(255,255,255,0.032) !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      border-radius: 18px !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      height: 100% !important;
      box-shadow: none !important;
      transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease !important;
    }
    .ps-card:hover {
      border-color: rgba(99,102,241,0.32) !important;
      transform: translateY(-4px) !important;
      box-shadow: 0 16px 48px rgba(0,0,0,0.35) !important;
    }

    /* ── Card image wrapper ── */
    .ps-card-img-wrap {
      position: relative;
      overflow: hidden;
      height: 175px;
      cursor: pointer;
    }
    .ps-card-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .ps-card:hover .ps-card-img-wrap img {
      transform: scale(1.04);
    }
    /* Subtle gradient overlay on image bottom */
    .ps-card-img-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent 40%,
        rgba(11,12,16,0.65) 100%
      );
      pointer-events: none;
    }

    /* ── Card content ── */
    .ps-card-content {
      padding: 22px 22px 20px !important;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .ps-card-title {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.97rem !important;
      font-weight: 700 !important;
      color: rgba(255,255,255,0.88) !important;
      margin-bottom: 8px !important;
      letter-spacing: -0.01em !important;
    }
    .ps-card-desc {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.42) !important;
      line-height: 1.7 !important;
      flex-grow: 1;
      margin-bottom: 18px !important;
    }

    /* ── Card buttons ── */
    .ps-btn-github {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.76rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.65) !important;
      border: 1px solid rgba(255,255,255,0.12) !important;
      border-radius: 999px !important;
      padding: 5px 16px !important;
      min-width: unset !important;
      transition: border-color 0.2s, color 0.2s, background 0.2s !important;
    }
    .ps-btn-github:hover {
      border-color: rgba(255,255,255,0.3) !important;
      color: #fff !important;
      background: rgba(255,255,255,0.06) !important;
    }
    .ps-btn-live {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.76rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase !important;
      color: #818cf8 !important;
      border: 1px solid rgba(99,102,241,0.3) !important;
      border-radius: 999px !important;
      padding: 5px 16px !important;
      min-width: unset !important;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
    }
    .ps-btn-live:hover {
      border-color: #818cf8 !important;
      background: rgba(99,102,241,0.1) !important;
      box-shadow: 0 0 14px rgba(99,102,241,0.22) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {
  projects: Project[];
};

function ProjectsSection({ projects }: Props) {
  React.useEffect(() => { injectStyles(); }, []);

  const navigate: NavigateFunction = useNavigate();

  // ── Logic untouched ──────────────────────────────────────────────────────
  const handleNavigation: (id: number) => void = (id) => {
    navigate("/oneprojectuser", {
      state: { id },
    });
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* ── Heading ── */}
      <Box mb={5}>
        <div className="ps-section-tag">Work</div>
        <Typography className="ps-section-title">Featured Projects</Typography>
        <Typography className="ps-section-sub">
          A selection of things I've shipped.
        </Typography>
      </Box>

      {/* ── Grid ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {projects.map((project) => (
          <Card key={project.id} className="ps-card">

            {/* Image */}
            <Box
              className="ps-card-img-wrap"
              onClick={() => handleNavigation(project.id as number)}
            >
              <CardMedia
                component="img"
                image={project.imageUrl}
                alt={project.projectName}
              />
            </Box>

            {/* Content */}
            <CardContent className="ps-card-content" sx={{ p: 0 }}>
              <Typography className="ps-card-title">
                {project.projectName}
              </Typography>
              <Typography className="ps-card-desc">
                {project.description}
              </Typography>

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {project.githubUrl && (
                  <Button
                    component="a"
                    href={project.githubUrl}
                    target="_blank"
                    className="ps-btn-github"
                    disableRipple={false}
                  >
                    GitHub
                  </Button>
                )}
                {project.liveUrl && (
                  <Button
                    component="a"
                    href={project.liveUrl}
                    target="_blank"
                    className="ps-btn-live"
                    disableRipple={false}
                  >
                    Live
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default ProjectsSection;