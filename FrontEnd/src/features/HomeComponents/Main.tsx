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

const Main = () => {
  const navigate = useNavigate();
  const [technologies, setTechnnologies] =
    React.useState<ArrayOfRendableTechnologies>([]);
    const [projects,setProjects] = React.useState<Project[]>([])

  const fetchBytechnoloy: (tech: TechType) => Promise<Technology[]> = async (
    tech
  ) => {
    try {
      return (
        await api.get(`/api/technologies/type/${tech}`)
      ).data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjects: ()=>Promise<void> = async ()=>{
    try {
      const response :AxiosResponse<Project[]> = await api.get(`${apiUrl}/api/projects/`)
      setProjects(response.data)

    } catch (error) {
      handleComponentError(error)
    }
  }

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
          return {
            text: mapTechTypeTolabel(type),
            techs,
          };
        })
      );

      setTechnnologies(results);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchAllTechnologies();
    fetchProjects()
  }, []);
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
        mt={6}
        p={3}
        borderRadius={2}
        bgcolor="#e3f2fd"
        boxShadow="0 2px 6px rgba(0,0,0,0.08)"
      >
         <Typography variant="h3" fontWeight={700} gutterBottom>
        Full-Stack Web Developer
      </Typography>

      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
        Hi, I'm a full-stack developer with expertise in the{" "}
        <strong>MERN stack</strong> and <strong>Java Spring Boot</strong>. I
        build fast, scalable, and user-friendly web applications.
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
        Skilled in both <strong>SQL</strong> and <strong>NoSQL</strong>{" "}
        databases (PostgreSQL, MySQL, MongoDB), I choose the right tool for the
        job to ensure performance, flexibility, and data integrity.
      </Typography>
      </Box>
      <ProjectsSection projects={projects}/>
        <TitleOfTechnologies/>
      {technologies.map((techObject, index) => (
        <Box
          key={index}
          sx={{
            mt: 4,
            mb: 4,
            p: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mb: 2, color: "primary.main" }}
          >
            {techObject.text}
          </Typography>
          <List disablePadding>
            {techObject.techs.map((tech) => (
              <ListItem
                key={tech.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                  mb: 1,
                  boxShadow: 1,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 3,
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={tech.logoUrl}
                    alt={tech.name}
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {tech.name}
                  </Typography>
                </Box>
                <CircularProgressWithLabel value={tech.score} />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}

      <Box mt={8} textAlign="center">
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Let’s build something great together!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/contactus")}
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            borderRadius: "999px",
            textTransform: "none",
            boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
          }}
        >
          Contact Me
        </Button>
      </Box>
    </Container>
  );
};

export default Main;
