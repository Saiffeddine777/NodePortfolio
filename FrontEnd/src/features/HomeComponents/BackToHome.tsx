import { Button } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate, type NavigateFunction } from "react-router";

type Props = {};

const BackToHome = ({}: Props) => {
  const navigate: NavigateFunction = useNavigate();

  const navigateToHome: () => void = () => {
    navigate("/");
  };

  return (
    <Button
      onClick={navigateToHome}
      startIcon={<ArrowBackRoundedIcon />}
      variant="outlined"
      size="small"
      sx={{
        color: "text.secondary",
        borderColor: "divider",
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 500,
        fontSize: "0.85rem",
        px: 2,
        py: 0.8,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "text.primary",
          color: "text.primary",
          backgroundColor: "action.hover",
          transform: "translateX(-3px)",  // ← subtle slide left on hover
        },
      }}
    >
      Back to Home
    </Button>
  );
};

export default BackToHome;