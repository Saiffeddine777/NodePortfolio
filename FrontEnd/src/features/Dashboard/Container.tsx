import { Box } from "@mui/material"
import { Route, Routes } from "react-router"
import WelcomeToDashboard from "./WelcomeToDashboard"
import Userlist from "./Users/Userlist"
import CreateUser from "./Users/CreateUser"
import ModifyUser from "./Users/ModifyUser"
import OneUser from "./Users/OneUser"
import TechnogiesList from "./Technologies/TechnogiesList"
import CreateTechnology from "./Technologies/CreateTechnology"
import ModifyTechnology from "./Technologies/ModifyTechnology"
import OneTechnology from "./Technologies/OneTechnology"
import EmailList from "./Emails/EmailList"
import OneEmail from "./Emails/OneEmail"
import ProjectList from "./Projects/ProjectList"
import OneProject from "./Projects/OneProject"

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
        </Routes>
    </Box>
  )
}

export default Container