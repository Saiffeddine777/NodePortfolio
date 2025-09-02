import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import {
  TechType,
  type ArrayOfRendableTechnologies,
  type Technology,
} from "../../Types/Technology";
import axios from "axios";
import React from "react";

const Main = () => {
  const navigate = useNavigate();
  const [technologies, setTechnnologies] =
    React.useState<ArrayOfRendableTechnologies>([]);

  const fetchBytechnoloy: (tech: TechType) => Promise<Technology[]> = async (
    tech
  ) => {
    try {
      return (
        await axios.get(`http://localhost:4000/api/technologies/type/${tech}`)
      ).data;
    } catch (error) {
      console.log(error);
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
  }, []);
  console.log(technologies);
return (
  <Container maxWidth="md" sx={{ py: 8 }}>
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

    {technologies.map((techObject, index) => (
      <Box
        key={index}
        sx={{
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
                px: 2,
                py: 1,
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              <ListItemText primary={tech.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    ))}

    {/* Featured Project */}
    <Box
      mt={6}
      p={3}
      borderRadius={2}
      bgcolor="#f1f8e9"
      boxShadow="0 2px 6px rgba(0,0,0,0.08)"
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Featured Project
      </Typography>
      <Typography variant="h6" fontWeight={500}>
        Developer Profile App
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 2, lineHeight: 1.7 }}>
        A full-stack web application built using Angular, Spring Boot,
        PostgreSQL, and MongoDB. Features JWT authentication, role-based access,
        and chat functionality.
      </Typography>
      <Button
        href="https://github.com/Saiffeddine777/developer-profile-app"
        target="_blank"
        variant="contained"
        color="primary"
      >
        View on GitHub
      </Button>
    </Box>

    {/* About Me */}
    <Box
      mt={6}
      p={3}
      borderRadius={2}
      bgcolor="#e3f2fd"
      boxShadow="0 2px 6px rgba(0,0,0,0.08)"
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        About Me
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
        I come from a marketing background and transitioned into software
        development out of a passion for technology. I'm constantly learning,
        building, and improving to become a well-rounded full-stack engineer.
      </Typography>
    </Box>

    {/* CTA */}
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
