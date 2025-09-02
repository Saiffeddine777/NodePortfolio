import { Box, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router";

type Props = {};

const Menu = ({}: Props) => {
  const listOfitems: string[] = ["Emails", "Users", "Technologies"];
  const navigate = useNavigate()

  const navigateToComp = (element:string)=>{
     switch (element) {
      case "Users":
        navigate("/dashboard/userlist")
        break;
      case "Technologies":
        navigate("/dashboard/technologies")
        break;
      default:
        break;
     }
  }
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
          return (            
              <ListItem key={key}>
                <ListItemText onClick={()=>navigateToComp(item)}>{item}</ListItemText>
              </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Menu;
