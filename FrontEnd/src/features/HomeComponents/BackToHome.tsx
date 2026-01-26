import { Button } from "@mui/material";
import { useNavigate, type NavigateFunction } from "react-router";

type Props = {};

const BackToHome = ({}: Props) => {
  const navigate: NavigateFunction = useNavigate();

  const navigateToHome: () => void = () => {
    navigate("/");
  };

  return <Button onClick={navigateToHome}>Back To Home</Button>;
};

export default BackToHome;
