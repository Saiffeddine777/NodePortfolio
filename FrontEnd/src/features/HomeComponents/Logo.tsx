import { Box } from "@mui/material";
import { useNavigate } from "react-router";
import logo from "../.././../public/terminal-svgrepo-com.svg";

type Props = {};

const Logo = ({}: Props) => {
  const navigate = useNavigate();

  const handleNavigateToHome: () => void = () => {
    navigate("/");
  };

  return (
    <Box
      onClick={handleNavigateToHome}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "scale(1.03)",
          opacity: 0.85,
        },
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          height: 48,
          width: "auto",
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

export default Logo;
