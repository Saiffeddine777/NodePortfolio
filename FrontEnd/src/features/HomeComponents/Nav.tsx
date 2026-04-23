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

/* ─── Injected styles ──────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "nav-custom-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

    .nav-root {
      font-family: 'DM Sans', sans-serif;
      background: rgba(10, 10, 14, 0.82);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-bottom: 1px solid rgba(255,255,255,0.07);
      position: sticky;
      top: 0;
      z-index: 1200;
      box-shadow: 0 4px 32px rgba(0,0,0,0.28);
    }

    /* Nav text buttons */
    .nav-text-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 500 !important;
      font-size: 0.82rem !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.62) !important;
      padding: 6px 14px !important;
      border-radius: 8px !important;
      transition: color 0.2s ease, background 0.2s ease !important;
      position: relative;
    }
    .nav-text-btn:hover {
      color: #fff !important;
      background: rgba(255,255,255,0.07) !important;
    }
    .nav-text-btn .MuiButton-startIcon {
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .nav-text-btn:hover .MuiButton-startIcon {
      opacity: 1;
    }

    /* Auth buttons */
    .nav-auth-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 500 !important;
      font-size: 0.82rem !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      border-radius: 9px !important;
      padding: 7px 20px !important;
      transition: all 0.22s ease !important;
    }
    .nav-auth-btn-ghost {
      color: rgba(255,255,255,0.7) !important;
      border: 1px solid rgba(255,255,255,0.18) !important;
      background: transparent !important;
    }
    .nav-auth-btn-ghost:hover {
      background: rgba(255,255,255,0.08) !important;
      border-color: rgba(255,255,255,0.35) !important;
      color: #fff !important;
    }
    .nav-auth-btn-solid {
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border: none !important;
      box-shadow: 0 4px 18px rgba(99,102,241,0.35) !important;
    }
    .nav-auth-btn-solid:hover {
      box-shadow: 0 6px 24px rgba(99,102,241,0.52) !important;
      transform: translateY(-1px);
    }

    /* Avatar button */
    .nav-avatar-btn {
      padding: 3px !important;
      border-radius: 50% !important;
      border: 2px solid rgba(255,255,255,0.12) !important;
      transition: border-color 0.2s ease, transform 0.2s ease !important;
    }
    .nav-avatar-btn:hover {
      border-color: rgba(99,102,241,0.7) !important;
      transform: scale(1.06);
    }

    /* Dropdown menu */
    .nav-menu .MuiPaper-root {
      background: rgba(18, 18, 24, 0.96) !important;
      backdrop-filter: blur(20px) !important;
      border: 1px solid rgba(255,255,255,0.09) !important;
      border-radius: 14px !important;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5) !important;
      padding: 6px !important;
      min-width: 185px !important;
    }
    .nav-menu-item {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      font-weight: 500 !important;
      color: rgba(255,255,255,0.72) !important;
      border-radius: 9px !important;
      padding: 9px 14px !important;
      transition: background 0.18s ease, color 0.18s ease !important;
    }
    .nav-menu-item:hover {
      background: rgba(255,255,255,0.07) !important;
      color: #fff !important;
    }
    .nav-menu-item .MuiListItemIcon-root {
      min-width: 34px;
      color: rgba(255,255,255,0.4);
      transition: color 0.18s;
    }
    .nav-menu-item:hover .MuiListItemIcon-root {
      color: #818cf8;
    }
    /* Logout item special */
    .nav-menu-item-logout {
      color: rgba(248,113,113,0.75) !important;
      margin-top: 4px !important;
      border-top: 1px solid rgba(255,255,255,0.06) !important;
      border-radius: 0 0 9px 9px !important;
    }
    .nav-menu-item-logout:hover {
      background: rgba(248,113,113,0.1) !important;
      color: #f87171 !important;
    }
    .nav-menu-item-logout .MuiListItemIcon-root {
      color: rgba(248,113,113,0.55);
    }
    .nav-menu-item-logout:hover .MuiListItemIcon-root {
      color: #f87171;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ─────────────────────────────────────────────────────────── */
const Nav = () => {
  React.useEffect(() => { injectStyles(); }, []);

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

  const handleNavigateToModifyYourSelf: () => void = () => {
    navigate("/modifyyourprofile", {
      state: { id: user.authUser?.id },
    });
  };

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

  const handleNavigateToJiraTickets: () => void = () => {
    navigate("/jiraprojects");
  };

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

  const modifyPropertyObject: NavigationButtonProperties = {
    text: "Settings",
    navFunction: handleNavigateToModifyYourSelf,
    icon: Settings,
  };

  const profilePropertyObject: NavigationButtonProperties = {
    text: "Profile",
    navFunction: handleNavigateToProfile,
    icon: AccountBox,
  };

  const jiraProjectsPropertyObject: NavigationButtonProperties = {
    text: "Report an issue",
    navFunction: handleNavigateToJiraTickets,
    icon: QuestionMark,
  };

  const menuItemsArray: ArrayOfNavigationButtonProperties = [
    profilePropertyObject,
    modifyPropertyObject,
    jiraProjectsPropertyObject,
    logoutPropertyObject,
  ];

  const userAuthButtons: ArrayOfNavigationButtonProperties = [
    ...(!user.authUser
      ? [
          {
            text: "Sign-Up",
            navFunction: navigateTo("/signup"),
            icon: Login,
          },
          {
            text: "Login",
            navFunction: navigateTo("/login"),
            icon: AppRegistration,
          },
        ]
      : []),
  ];

  return (
    <Box className="nav-root">
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: "10px",
        }}
      >
        {/* Logo */}
        <Logo />

        {/* Centre nav links */}
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          {buttonTexts.map((btn, i) => {
            const Icon = btn?.icon;
            return btn ? (
              <Button
                key={i}
                variant="text"
                onClick={btn?.navFunction}
                startIcon={Icon ? <Icon fontSize="small" /> : undefined}
                className="nav-text-btn"
                disableRipple={false}
              >
                {btn?.text}
              </Button>
            ) : (
              <React.Fragment key={i} />
            );
          })}
        </Box>

        {/* Right side — auth or avatar */}
        {user.authUser === null ? (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            {userAuthButtons.map((btn, i) => {
              const Icon = btn?.icon;
              return btn ? (
                <Button
                  key={i}
                  variant={i === 0 ? "outlined" : "contained"}
                  onClick={btn?.navFunction}
                  startIcon={Icon ? <Icon fontSize="small" /> : undefined}
                  className={`nav-auth-btn ${
                    i === 0 ? "nav-auth-btn-ghost" : "nav-auth-btn-solid"
                  }`}
                  disableElevation
                >
                  {btn?.text}
                </Button>
              ) : (
                <React.Fragment key={i} />
              );
            })}
          </Box>
        ) : (
          <Box>
            <IconButton
              onClick={handleOpen}
              size="small"
              className="nav-avatar-btn"
            >
              <Avatar
                alt={user.authUser.firstName}
                src={user.authUser?.imageUrl}
                sx={{ width: 34, height: 34 }}
              />
            </IconButton>

            <Menu
              className="nav-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: { mt: 1.2, overflow: "visible" },
                },
              }}
            >
              {menuItemsArray.map(
                (item, index) =>
                  item && (
                    <MenuItem
                      key={index}
                      onClick={item.navFunction}
                      className={`nav-menu-item ${
                        item.text === "Logout" ? "nav-menu-item-logout" : ""
                      }`}
                    >
                      <ListItemIcon>
                        {item.icon && <item.icon fontSize="small" />}
                      </ListItemIcon>
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