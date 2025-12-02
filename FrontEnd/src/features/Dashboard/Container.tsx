import { Box } from "@mui/material"
import { Route, Routes } from "react-router"
import WelcomeToDashboard from "./WelcomeToDashboard.tsx"
import Userlist from "./Users/Userlist.tsx"
import CreateUser from "./Users/CreateUser.tsx"
import ModifyUser from "./Users/ModifyUser.tsx"
import OneUser from "./Users/OneUser.tsx"
import TechnogiesList from "./Technologies/TechnogiesList.tsx"
import CreateTechnology from "./Technologies/CreateTechnology.tsx"
import ModifyTechnology from "./Technologies/ModifyTechnology.tsx"
import OneTechnology from "./Technologies/OneTechnology.tsx"
import EmailList from "./Emails/EmailList.tsx"
import OneEmail from "./Emails/OneEmail.tsx"
import ProjectList from "./Projects/ProjectList.tsx"
import OneProject from "./Projects/OneProject.tsx"
import CreateProject from "./Projects/CreateProject.tsx"
import UpdateProject from "./Projects/UpdateProject.tsx"

type Props = {}

const Container = ({}: Props) => {
  return (
    <Box
     sx={{
        flex: "1",
        border: "1px solid violet",
        borderRadius: "5%",
        height: "100%",
        boxSizing: "border-box",
        padding:"5%"
      }}
    >
        <Routes>
          <Route Component={WelcomeToDashboard} path="/"></Route>
          <Route Component={Userlist} path="/userlist"></Route>
          <Route Component={CreateUser} path="/createuser"></Route>
          <Route Component={ModifyUser} path="/modifyuser"></Route>
          <Route Component={OneUser} path="/oneuser"></Route>
          <Route Component={TechnogiesList} path="/technologies"></Route>
          <Route Component={CreateTechnology} path="/createtechnology"></Route>
          <Route Component={ModifyTechnology} path ="/modifytechnology" ></Route>
          <Route Component={OneTechnology} path ="/onetechnology" ></Route>
          <Route Component={EmailList} path={"/emaillist"}></Route>
          <Route Component={OneEmail} path="/onemail"></Route>
          <Route Component={ProjectList} path="/projectlist"></Route>
          <Route Component={OneProject} path="/oneproject"></Route>
          <Route Component={CreateProject} path="/createproject"></Route>
          <Route Component={UpdateProject} path="/updateproject"></Route>
        </Routes>
    </Box>
  )
}

export default Container