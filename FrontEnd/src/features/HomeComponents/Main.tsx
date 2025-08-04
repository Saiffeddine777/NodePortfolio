import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";

type Props = {};

const Main = ({}: Props) => {
  const navigate = useNavigate();
  return (
    <Box>
      <Box>
        <Typography variant="h4" gutterBottom>
          Full-Stack Web Developer
        </Typography>
        <Typography variant="body1" gutterBottom>
          Hi, I'm a full-stack developer with expertise in the{" "}
          <strong>MERN stack</strong> and <strong>Java Spring Boot</strong>. I
          build fast, scalable, and user-friendly web applications.
        </Typography>
        <Typography variant="body1">
          Skilled in both <strong>SQL</strong> and <strong>NoSQL</strong>{" "}
          databases (PostgreSQL, MySQL, MongoDB), I choose the right tool for
          the job to ensure performance, flexibility, and data integrity.
        </Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="h5">Tech Stack</Typography>
        <Typography variant="body2">Languages & Frameworks:</Typography>
        <ul>
          <li>JavaScript / TypeScript</li>
          <li>React.js, Node.js, Express</li>
          <li>Java, Spring Boot</li>
        </ul>
        <Typography variant="body2">Databases:</Typography>
        <ul>
          <li>MongoDB, PostgreSQL, MySQL</li>
        </ul>
        <Typography variant="body2">Tools & Others:</Typography>
        <ul>
          <li>Git, Docker, Postman, GitHub Actions (CI/CD), REST APIs</li>
        </ul>
      </Box>
      <Box mt={4}>
        <Typography variant="h5">Featured Projects</Typography>
        <Box>
          <Typography variant="h6">Developer Profile App</Typography>
          <Typography variant="body2">
            A full-stack web application built using Angular, Spring Boot,
            PostgreSQL, and MongoDB. Features JWT authentication, role-based
            access, and chat functionality.
          </Typography>
          <Button
            href="https://github.com/Saiffeddine777/developer-profile-app"
            target="_blank"
            variant="outlined"
            sx={{ mt: 1 }}
          >
            View on GitHub
          </Button>
        </Box>
      </Box>
      <Box mt={4}>
        <Typography variant="h5">About Me</Typography>
        <Typography variant="body2">
          I come from a marketing background and transitioned into software
          development out of a passion for technology. I'm constantly learning,
          building, and improving to become a well-rounded full-stack engineer.
        </Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="h6">
          Let's build something great together!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/contactus")}
          sx={{ mt: 1 }}
        >
          Contact Me
        </Button>
      </Box>
    </Box>
  );
};

export default Main;
