import { Box } from "@mui/material";
import Container from "./Container.tsx";
import Menu from "./Menu.tsx";

type Props = {};

const Dashboard = ({}: Props) => {
  return (
    <Box
      sx={{
    display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
        gap: "2%",       // space between Menu and Container
        p: "2%",         // padding inside the box
        boxSizing: "border-box", // ensures padding doesn't overflow
        overflow: "hidden",      // prevent scrollbars if tiny rounding errors occur
      }}
    >
      <Menu />
      <Container />
    </Box>
  );
};

export default Dashboard;
