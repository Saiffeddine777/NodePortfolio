import { Box, Paper } from "@mui/material";
import { Routes, Route } from "react-router";
import WelcomeToDashboard from "./WelcomeToDashboard.tsx";
import Userlist from "./Users/Userlist.tsx";
import CreateUser from "./Users/CreateUser.tsx";
import ModifyUser from "./Users/ModifyUser.tsx";
import OneUser from "./Users/OneUser.tsx";
import TechnogiesList from "./Technologies/TechnogiesList.tsx";
import CreateTechnology from "./Technologies/CreateTechnology.tsx";
import ModifyTechnology from "./Technologies/ModifyTechnology.tsx";
import OneTechnology from "./Technologies/OneTechnology.tsx";
import EmailList from "./Emails/EmailList.tsx";
import OneEmail from "./Emails/OneEmail.tsx";
import ProjectList from "./Projects/ProjectList.tsx";
import OneProject from "./Projects/OneProject.tsx";
import CreateProject from "./Projects/CreateProject.tsx";
import UpdateProject from "./Projects/UpdateProject.tsx";
import PortfolioFileList from "./PortfolioFiles/PortfolioFileList.tsx";
import CreatePortfolioFile from "./PortfolioFiles/CreatePortfolioFile.tsx";

const Container = () => {
  return (
    <Box
      sx={{
        flex: 1,
        height: "100vh",
        p: 3,
        overflow: "auto",
        bgcolor: "grey.100",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 3,
          minHeight: "100%",
          borderRadius: 3,
        }}
      >
        <Routes>
          <Route path="/" Component={WelcomeToDashboard} />
          <Route path="/userlist" Component={Userlist} />
          <Route path="/createuser" Component={CreateUser} />
          <Route path="/modifyuser" Component={ModifyUser} />
          <Route path="/oneuser" Component={OneUser} />
          <Route path="/technologies" Component={TechnogiesList} />
          <Route path="/createtechnology" Component={CreateTechnology} />
          <Route path="/modifytechnology" Component={ModifyTechnology} />
          <Route path="/onetechnology" Component={OneTechnology} />
          <Route path="/emaillist" Component={EmailList} />
          <Route path="/onemail" Component={OneEmail} />
          <Route path="/projectlist" Component={ProjectList} />
          <Route path="/oneproject" Component={OneProject} />
          <Route path="/createproject" Component={CreateProject} />
          <Route path="/updateproject" Component={UpdateProject} />
          <Route path="/portfoliofilelist" Component={PortfolioFileList} />
          <Route
            path="/createportfoliofile"
            Component={CreatePortfolioFile}
          />
        </Routes>
      </Paper>
    </Box>
  );
};

export default Container;
