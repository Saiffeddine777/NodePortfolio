import { Box, Button, Container } from "@mui/material";
import { useNavigate } from "react-router";

type ArrayOfNavigationButtonProperties = {
  text: string;
  navFunction: () => void;
}[];

const Nav = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => () => navigate(path);

  const buttonTexts: ArrayOfNavigationButtonProperties = [
    { text: "Dashboard", navFunction: navigateTo("/dashboard") },
    { text: "CV", navFunction: navigateTo("/cv") },
    { text: "Contact Us", navFunction: navigateTo("/contactus") },
  ];

  const userAuthButtons: ArrayOfNavigationButtonProperties = [
    { text: "Sign-Up", navFunction: navigateTo("/signup") },
    { text: "Login", navFunction: navigateTo("/login") },
  ];

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 2, boxShadow: 1 }}>
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {buttonTexts.map((btn, i) => (
            <Button key={i} variant="outlined" onClick={btn.navFunction}>
              {btn.text}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          {userAuthButtons.map((btn, i) => (
            <Button key={i} variant="contained" onClick={btn.navFunction}>
              {btn.text}
            </Button>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Nav;
