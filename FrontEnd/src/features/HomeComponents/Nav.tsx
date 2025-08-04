import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router";

type Props = {};
type ArrayOfNavigationButtonProperties = {
  text: string;
  navFunction: () => void;
}[];
const Nav = ({}: Props) => {
  const navigate = useNavigate();
  const navigateToDashBoard: () => void = () => {
    console.log("Invoked")
    navigate("/dashboard");
  };

  const navigateToCV: () => void = () => {
    navigate("/cv");
  };

  const navigateToContactUs: () => void = () => {
    navigate("/contactus");
  };

  const navigateToSignIn: () => void = () => {
    navigate("/login");
  };

  const navigateToSignUp: () => void = () => {
    navigate("/signup");
  };
  const buttonTexts: ArrayOfNavigationButtonProperties = [
    {text: "Dashboard", navFunction: navigateToDashBoard },
    {text: "Cv" , navFunction : navigateToCV},
    {text:"Contact Us" , navFunction : navigateToContactUs},
  ];
  const userAuthButtons: ArrayOfNavigationButtonProperties = [
    {text:"Sign-Up" , navFunction : navigateToSignUp }, 
    {text :"Login" , navFunction : navigateToSignIn}
  ];

  return (
    <Box
      sx={{
        marginTop: "2%",
        display: "flex",
        backgroundColor: "ButtonFace",
        padding: "1%",
      }}
    >
      <Box
        sx={{
          marginRight: "60%",
          display: "flex",
          gap: "10px",
        }}
      >
        {buttonTexts.map((e, i) => (
          <Button 
          onClick={e.navFunction}
          variant="outlined" sx={{}} key={i}>
            {e.text}
          </Button>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
        }}
      >
        {userAuthButtons.map((e, i) => (
          <Button 
          onClick={e.navFunction}
          variant="contained" key={i}>
            {e.text}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Nav;
