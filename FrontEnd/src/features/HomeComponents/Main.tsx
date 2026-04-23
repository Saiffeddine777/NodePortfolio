import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  Typography,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router";
import {
  TechType,
  type ArrayOfRendableTechnologies,
  type Technology,
} from "../../Types/Technology.ts";
import { type AxiosResponse } from "axios";
import React from "react";
import CircularProgressWithLabel from "../Components/CircularProgressWithLabel.tsx";
import type { Project } from "../../Types/Project.ts";
import { apiUrl } from "../../Urls.ts";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import ProjectsSection from "./ProjectsSection.tsx";
import { api } from "../../ApiService/ApiBrain.ts";
import TitleOfTechnologies from "./TitleOfTechnologies.tsx";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "main-custom-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Page background ── */
    .main-page-bg {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
      font-family: 'DM Sans', sans-serif;
    }

    /* ── Hero card ── */
    .main-hero {
      position: relative;
      border-radius: 20px;
      background: rgba(255,255,255,0.035);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 48px 52px;
      overflow: hidden;
    }
    .main-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 60%);
      pointer-events: none;
    }
    .main-hero-tag {
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
      margin-bottom: 20px;
    }
    .main-hero-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: clamp(2rem, 5vw, 3rem) !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      line-height: 1.15 !important;
      letter-spacing: -0.01em !important;
      margin-bottom: 24px !important;
    }
    .main-hero-body {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 1rem !important;
      color: rgba(255,255,255,0.55) !important;
      line-height: 1.85 !important;
      margin-bottom: 14px !important;
    }
    .main-hero-body strong {
      color: rgba(255,255,255,0.85);
      font-weight: 600;
    }

    /* ── Tech section ── */
    .main-tech-group {
      border-radius: 16px;
      background: rgba(255,255,255,0.028);
      border: 1px solid rgba(255,255,255,0.07);
      padding: 28px 32px;
      transition: border-color 0.2s;
    }
    .main-tech-group:hover {
      border-color: rgba(99,102,241,0.22);
    }
    .main-tech-group-title {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.13em !important;
      text-transform: uppercase !important;
      color: #818cf8 !important;
      margin-bottom: 20px !important;
    }

    /* ── Tech list item ── */
    .main-tech-item {
      background: rgba(255,255,255,0.03) !important;
      border: 1px solid rgba(255,255,255,0.06) !important;
      border-radius: 12px !important;
      padding: 14px 18px !important;
      margin-bottom: 10px !important;
      transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease !important;
    }
    .main-tech-item:hover {
      background: rgba(99,102,241,0.07) !important;
      border-color: rgba(99,102,241,0.28) !important;
      transform: translateX(4px) !important;
    }
    .main-tech-name {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      font-weight: 600 !important;
      color: rgba(255,255,255,0.82) !important;
    }

    /* ── CTA section ── */
    .main-cta-wrap {
      text-align: center;
      margin-top: 80px;
      padding: 56px 32px;
      border-radius: 20px;
      background: rgba(255,255,255,0.028);
      border: 1px solid rgba(255,255,255,0.07);
    }
    .main-cta-heading {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.75rem !important;
      font-style: italic !important;
      color: #f1f5f9 !important;
      margin-bottom: 24px !important;
      font-weight: 400 !important;
    }
    .main-cta-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 600 !important;
      font-size: 0.88rem !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 13px 40px !important;
      box-shadow: 0 6px 28px rgba(99,102,241,0.38) !important;
      border: none !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .main-cta-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }

    /* ── Avatar override ── */
    .main-tech-avatar {
      background: rgba(255,255,255,0.06) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const Main = () => {
  React.useEffect(() => { injectStyles(); }, []);

  const navigate = useNavigate();
  const [technologies, setTechnnologies] =
    React.useState<ArrayOfRendableTechnologies>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);

  const fetchBytechnoloy: (tech: TechType) => Promise<Technology[]> = async (
    tech
  ) => {
    try {
      return (await api.get(`/api/technologies/type/${tech}`)).data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjects: () => Promise<void> = async () => {
    try {
      const response: AxiosResponse<Project[]> = await api.get(
        `${apiUrl}/api/projects/`
      );
      setProjects(response.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const mapTechTypeTolabel: (type: TechType) => string = (type) => {
    switch (type) {
      case TechType.LANGUAGE:
        return "Programming languages";
      case TechType.FRONTEND:
        return "FrontEnd frameworks";
      case TechType.BACKEND:
        return "Backend technologies";
      case TechType.DATABASE:
        return "Database technologies";
      case TechType.INFRASTRUCTURE:
        return "Infrastructure technologies";
      case TechType.TOOLS:
        return "Developpement Tools";
      default:
        return "Unknown";
    }
  };

  const fetchAllTechnologies: () => Promise<void> = async () => {
    try {
      const arrayOfTechnogies: TechType[] = [
        TechType.LANGUAGE,
        TechType.FRONTEND,
        TechType.BACKEND,
        TechType.DATABASE,
        TechType.INFRASTRUCTURE,
        TechType.TOOLS,
      ];
      const results: ArrayOfRendableTechnologies = await Promise.all(
        arrayOfTechnogies.map(async (type) => {
          const techs = (await fetchBytechnoloy(type)) ?? [];
          return { text: mapTechTypeTolabel(type), techs };
        })
      );
      setTechnnologies(results);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchAllTechnologies();
    fetchProjects();
  }, []);

  return (
    <Box className="main-page-bg">
      <Container maxWidth="md" sx={{ py: 8 }}>

        {/* ── Hero ── */}
        <Box className="main-hero" mt={2}>
          <div className="main-hero-tag">Available for work</div>
          <Typography className="main-hero-title">
            Full-Stack Web Developer
          </Typography>
          <Typography className="main-hero-body">
            Hi, I'm a full-stack developer with expertise in the{" "}
            <strong>MERN stack</strong> and <strong>Java Spring Boot</strong>. I
            build fast, scalable, and user-friendly web applications.
          </Typography>
          <Typography className="main-hero-body" sx={{ mb: 0 }}>
            Skilled in both <strong>SQL</strong> and <strong>NoSQL</strong>{" "}
            databases (PostgreSQL, MySQL, MongoDB), I choose the right tool for
            the job to ensure performance, flexibility, and data integrity.
          </Typography>
        </Box>

        {/* ── Projects ── */}
        <Box mt={6}>
          <ProjectsSection projects={projects} />
        </Box>

        {/* ── Technologies heading ── */}
        <Box mt={6}>
          <TitleOfTechnologies />
        </Box>

        {/* ── Technology groups ── */}
        {technologies.map((techObject, index) => (
          <Box key={index} className="main-tech-group" mt={3}>
            <Typography className="main-tech-group-title">
              {techObject.text}
            </Typography>
            <List disablePadding>
              {techObject.techs.map((tech) => (
                <ListItem
                  key={tech.name}
                  className="main-tech-item"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={tech.logoUrl}
                      alt={tech.name}
                      className="main-tech-avatar"
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography className="main-tech-name">
                      {tech.name}
                    </Typography>
                  </Box>
                  <CircularProgressWithLabel value={tech.score} />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}

        {/* ── CTA ── */}
        <Box className="main-cta-wrap">
          <Typography className="main-cta-heading">
            Let's build something great together.
          </Typography>
          <Button
            variant="contained"
            className="main-cta-btn"
            onClick={() => navigate("/contactus")}
            disableElevation
          >
            Contact Me
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Main;