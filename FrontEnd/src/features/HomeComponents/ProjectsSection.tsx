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

type Props = {
  projects: Project[];
};

function ProjectsSection({ projects }: Props) {
  const navigate: NavigateFunction = useNavigate();
  const handleNavigation: (id: number) => void = (id) => {
    navigate("/oneprojectuser", {
      state: {
        id: id,
      },
    });
  };
  return (
    <Box sx={{ mt: 8, px: { xs: 2, md: 8 } }}>
      <Typography
        variant="h4"
        component="h2"
        fontWeight={500}
        color="text.primary"
        textAlign="center"
        gutterBottom
      >
        Featured Projects
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 4,
        }}
      >
        {projects.map((project) => (
          <Card
            key={project.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }}
          >
            <CardMedia
              component="img"
              image={project.imageUrl}
              alt={project.projectName}
              sx={{ height: 170, objectFit: "cover" }}
              onClick={() => handleNavigation(project.id as number)}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {project.projectName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {project.description}
              </Typography>

              {project.githubUrl && (
                <Button
                  component="a"
                  href={project.githubUrl}
                  target="_blank"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  GitHub
                </Button>
              )}

              {project.liveUrl && (
                <Button
                  component="a"
                  href={project.liveUrl}
                  target="_blank"
                  size="small"
                >
                  Live
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default ProjectsSection;
