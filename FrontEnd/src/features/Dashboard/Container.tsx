import { Box } from "@mui/material";
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
import TicketsList from "./Tickets/TicketsList.tsx";
import OneTicket from "./Tickets/OneTicket.tsx";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "container-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Outer scroll area ── */
    .dc-scroll {
      flex: 1;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
      padding: 16px;
      font-family: 'DM Sans', sans-serif;

      /* Custom scrollbar */
      scrollbar-width: thin;
      scrollbar-color: rgba(99,102,241,0.25) transparent;
    }
    .dc-scroll::-webkit-scrollbar {
      width: 5px;
    }
    .dc-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .dc-scroll::-webkit-scrollbar-thumb {
      background: rgba(99,102,241,0.25);
      border-radius: 999px;
    }
    .dc-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(99,102,241,0.45);
    }

    /* ── Inner glass panel ── */
    .dc-panel {
      min-height: 100%;
      border-radius: 16px;
      background: rgba(255,255,255,0.022);
      border: 1px solid rgba(255,255,255,0.06);
      box-sizing: border-box;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const Container = () => {
  useEffect(() => { injectStyles(); }, []);

  return (
    <Box className="dc-scroll">
      <Box className="dc-panel">

        {/* ── Routes untouched ── */}
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
          <Route path="/createportfoliofile" Component={CreatePortfolioFile} />
          <Route path="/ticketlist" Component={TicketsList} />
          <Route path="/oneticket" Component={OneTicket} />
        </Routes>

      </Box>
    </Box>
  );
};

export default Container;