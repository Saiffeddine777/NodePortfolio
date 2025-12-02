import { Box, List, ListItem, ListItemText , ListItemIcon } from "@mui/material";
import { useNavigate } from "react-router";
import type { ArrayOfMenuItems } from "../../Types/Utilities.ts";
import { AccountTree, Biotech, Email, Home, SupervisedUserCircle } from "@mui/icons-material";

type Props = {};

const Menu = ({}: Props) => {
  const listOfitems: ArrayOfMenuItems[] = [
    {name :"Home" , icon : Home},
    {name :"Emails" , icon :Email}, 
    {name :"Users" , icon : SupervisedUserCircle }, 
    {name :"Technologies" , icon :  Biotech} , 
    {name :"Projects" , icon : AccountTree}
  ];
  const navigate = useNavigate();

  const navigateToComp = (element: string) => {
    switch (element) {
      case "Home":
        navigate("/")
        break;
      case "Users":
        navigate("/dashboard/userlist");
        break;
      case "Technologies":
        navigate("/dashboard/technologies");
        break;
      case "Emails":
        navigate("/dashboard/emaillist");
        break;
      case "Projects":
        navigate("/dashboard/projectlist")
         break ;
      default:
        break;
    }
  };
  return (
<Box
      sx={{
        flex: "0 0 20%",
        border: "1px solid violet",
        borderRadius: "10%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <List>
        {listOfitems.map((item, key) => {
          const IconComponent = item.icon;
          return (
            <ListItem
              key={key}
              onClick={() => navigateToComp(item.name)}
              sx={{
                cursor : "pointer",
                "&:hover": {
                  backgroundColor: "rgba(138,43,226,0.1)", // violet glow
                },
                borderRadius: 2,
                my: 0.5,
              }}
            >
              <ListItemIcon>
                <IconComponent color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{ cursor: "pointer" }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Menu; 
