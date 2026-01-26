import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router";
import {
  AccountTree,
  Biotech,
  Email,
  Home,
  SupervisedUserCircle,
  FileUpload,
} from "@mui/icons-material";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const listOfItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Emails", icon: Email, path: "/dashboard/emaillist" },
    { name: "Users", icon: SupervisedUserCircle, path: "/dashboard/userlist" },
    { name: "Technologies", icon: Biotech, path: "/dashboard/technologies" },
    { name: "Projects", icon: AccountTree, path: "/dashboard/projectlist" },
    { name: "Files", icon: FileUpload, path: "/dashboard/portfoliofilelist" },
  ];

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        p: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      <List>
        {listOfItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <ListItem
              key={item.name}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                mb: 1,
                bgcolor: isActive ? "primary.main" : "transparent",
                color: isActive ? "primary.contrastText" : "text.primary",
                "&:hover": {
                  bgcolor: isActive
                    ? "primary.dark"
                    : "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive
                    ? "primary.contrastText"
                    : "primary.main",
                  minWidth: 40,
                }}
              >
                <Icon />
              </ListItemIcon>

              <ListItemText primary={item.name} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Menu;
