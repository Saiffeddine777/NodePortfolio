import {
  ContactMail,
  Dashboard,
  ListAltOutlined,
  Login,
  AppRegistration,
  Logout,
  AccountBox,
  Settings,
  QuestionMark
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router";
import type { UserAuthAPiType, UserRole } from "../../Types/User.ts";
import { useAppDispatch, useAppSelector } from "../../app/Hooks.ts";
import { api } from "../../ApiService/ApiBrain.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { resetUser } from "../Auth/UserAuthReducer.ts";

import {
  type NavigationButtonProperties,
  type ArrayOfNavigationButtonProperties,
} from "../../Types/Utilities.ts";
import React from "react";
import Logo from "./Logo.tsx";

const Nav = () => {
  const navigate = useNavigate();
  const navigateTo = (path: string) => () => navigate(path);
  const dispatch = useAppDispatch();

  const user: UserAuthAPiType = useAppSelector((state) => state.userAuth);
  const role: UserRole | undefined = user.authUser
    ? user.authUser.role
    : undefined;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose: () => void = () => {
    setAnchorEl(null);
  };

  const handleNavigateToModifyYourSelf : ()=>void = ()=>{
    navigate("/modifyyourprofile" , {state:{
      id : user.authUser?.id
    }});
  }

  const logout: () => void = () => {
    api
      .post(`api/users/logout`)
      .then((res) => handleSuccess("Logout Succes", res.data.message))
      .catch((err) => handleComponentError(err))
      .finally(() => {
        localStorage.removeItem("accessToken");
        dispatch(resetUser());
      });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleNavigateToProfile: () => void = () => {
    navigate("/authenticateduser");
  };

  const handleNavigateToJiraTickets : ()=>void = ()=>{
    navigate("/jiraprojects")
  }

  const buttonTexts: ArrayOfNavigationButtonProperties = [
    role === "Admin"
      ? {
          text: "Dashboard",
          navFunction: navigateTo("/dashboard"),
          icon: Dashboard,
        }
      : undefined,
    { text: "CV", navFunction: navigateTo("/cv"), icon: ListAltOutlined },
    {
      text: "Contact Us",
      navFunction: navigateTo("/contactus"),
      icon: ContactMail,
    },
  ];

  const logoutPropertyObject: NavigationButtonProperties = {
    text: "Logout",
    navFunction: logout,
    icon: Logout,
  };

  const modifyPropertyObject : NavigationButtonProperties={
    text : "Settings",
    navFunction : handleNavigateToModifyYourSelf,
    icon : Settings
  }

  const profilePropertyObject: NavigationButtonProperties = {
    text: "Profile",
    navFunction: handleNavigateToProfile,
    icon: AccountBox,
  };
    const jiraProjectsPropertyObject: NavigationButtonProperties = {
    text: "Report an issue",
    navFunction: handleNavigateToJiraTickets,
    icon: QuestionMark ,
  };

  const menuItemsArray: ArrayOfNavigationButtonProperties = [
    profilePropertyObject,
    modifyPropertyObject,
    jiraProjectsPropertyObject,
    logoutPropertyObject
  ];

  const userAuthButtons: ArrayOfNavigationButtonProperties = [
    ...(!user.authUser
      ? [
          { text: "Sign-Up", navFunction: navigateTo("/signup"), icon: Login },
          {
            text: "Login",
            navFunction: navigateTo("/login"),
            icon: AppRegistration,
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 2, boxShadow: 1 }}>
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Logo/>
        <Box sx={{ display: "flex", gap: 2 }}>
          {buttonTexts.map((btn, i) => {
            const Icon = btn?.icon;
            return btn ? (  
              <Button
                key={i}
                variant="text"
                onClick={btn?.navFunction}
                startIcon={Icon ? <Icon /> : undefined}
              >
                {btn?.text}
              </Button>
            ) : (
              <></>
            );
          })}
        </Box>

        {user.authUser === null ? (
          <Box sx={{ display: "flex", gap: 2 }}>
            {userAuthButtons.map((btn, i) => {
              const Icon = btn?.icon;
              return btn ? (
                <Button
                  key={i}
                  variant="contained"
                  onClick={btn?.navFunction}
                  startIcon={Icon ? <Icon /> : undefined}
                >
                  {btn?.text}
                </Button>
              ) : (
                <></>
              );
            })}
          </Box>
        ) : (
          <Box>
            <IconButton onClick={handleOpen} size="small">
              <Avatar
                alt={user.authUser.firstName}
                src={user.authUser?.imageUrl}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {menuItemsArray.map(
                (item, index) =>
                  item && (
                    <MenuItem key={index} onClick={item.navFunction}>
                      <ListItemIcon>{item.icon && <item.icon />}</ListItemIcon>
                      {item.text}
                    </MenuItem>
                  ),
              )}
            </Menu>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Nav;
