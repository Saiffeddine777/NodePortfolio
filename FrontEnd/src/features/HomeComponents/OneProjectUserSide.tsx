import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { useLocation, type Location } from "react-router";
import type { AxiosResponse } from "axios";

import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { api } from "../../ApiService/ApiBrain.ts";
import type { Project } from "../../Types/Project.ts";

type Props = {};

const OneProjectUserSide = ({}: Props) => {
  const location: Location<{ id: number }> = useLocation();
  const [oneProject, setOneProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);

  const handleGetOneProject = async (): Promise<void> => {
    try {
      const result: AxiosResponse<Project> = await api.get(
        `/api/projects/${location.state.id}`
      );
      setOneProject(result.data);
    } catch (error) {
      handleComponentError(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleGetOneProject();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!oneProject) {
    return (
      <Typography align="center" mt={10}>
        Project not found
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Card elevation={6} sx={{ borderRadius: 4 }}>
        {/* Project Image */}
        {oneProject.imageUrl && (
          <CardMedia
            component="img"
            height="360"
            image={oneProject.imageUrl}
            alt={oneProject.projectName}
            sx={{ objectFit: "cover" }}
          />
        )}

        <CardContent sx={{ p: 4 }}>
          {/* Title & Category */}
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              {oneProject.projectName}
            </Typography>

            <Chip
              label={oneProject.category}
              color="primary"
              size="small"
              sx={{ width: "fit-content" }}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Description */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {oneProject.description}
          </Typography>

          {/* Tech Stack */}
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 4 }}
          >
            {oneProject.techStack.map((tech) => (
              <Chip key={tech} label={tech} variant="outlined" />
            ))}
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={2}>
            {oneProject.githubUrl && (
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href={oneProject.githubUrl}
                target="_blank"
              >
                GitHub
              </Button>
            )}

            {oneProject.liveUrl && (
              <Button
                variant="outlined"
                startIcon={<LaunchIcon />}
                href={oneProject.liveUrl}
                target="_blank"
              >
                Live Demo
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OneProjectUserSide;
