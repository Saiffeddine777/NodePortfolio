import React from "react";
import type { Project } from "../../../Types/Project.ts";
import type { AxiosResponse } from "axios";
import { useLocation, useNavigate, type Location, type NavigateFunction } from "react-router";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

function OneProject({}: Props) {
  const location: Location<{ id?: number }> = useLocation();
  const [project, setProject] = React.useState<Project | null>(null);
  const navigate:NavigateFunction = useNavigate()

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

  if (!project) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  const navigateToProjects : ()=>void = ()=>{
    navigate("/dashboard/projectlist")
  }

  return (
    <>
    <Button
      variant="contained"
      onClick={navigateToProjects}
      >
      back to Projects
      </Button>  
    <Card
      sx={{ maxWidth: 800, margin: "2rem auto", boxShadow: 4, borderRadius: 3 }}
    >
      {/* Project Image */}
      {project.imageUrl && (
        <CardMedia
          component="img"
          height="300"
          image={project.imageUrl}
          alt={project.projectName}
        />
      )}

      <CardContent>
        {/* Title */}
        <Typography variant="h4" gutterBottom>
          {project.projectName}
        </Typography>

        {/* Description */}
        <Typography variant="body1" color="text.secondary" paragraph>
          {project.description}
        </Typography>

        {/* Tech Stack */}
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          {project.techStack.map((tech) => (
            <Chip key={tech} label={tech} color="primary" variant="outlined" />
          ))}
        </Stack>

        {/* Links */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="inherit"
            href={project.githubUrl || ""}
            target="_blank"
          >
            GitHub
          </Button>

          <Button
            variant="contained"
            color="success"
            href={project.liveUrl || ""}
            target="_blank"
          >
            Live Demo
          </Button>
        </Stack>
      </CardContent>
    </Card>
  </>
  );
}

export default OneProject;
