import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { AxiosResponse } from "axios";
import React from "react";
import { useNavigate } from "react-router";
import type { User } from "../../../Types/User.tsx";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import DeleteUser from "./DeleteUser.tsx";
import EditIcon from '@mui/icons-material/Edit';
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

const Userlist = ({}: Props) => {
  
  const navigate = useNavigate();
  const [users, setUsers] = React.useState<User[]>([]);
  const [trigg , setTrigg] = React.useState<boolean>(false)
  
  const navigateToCreateAuser = () => {
    navigate("/dashboard/createuser");
  };

  const headTitles: string[] = [
    "id",
    "First Name",
    "Last Name",
    "Occupation",
    "Actions",
  ];

  const fetchUserList: () => Promise<void> = async () => {
    try {
      const response: AxiosResponse<User[]> = await api.get(
        `/api/users`
      );
      setUsers(response.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToUserSomething : ( path : string,id?:number ) =>void =(path,id) =>{
      navigate(`/dashboard/${path}`,{state:{
        id :id
      }})
  }

  React.useEffect(() => {
    fetchUserList();
  }, [trigg]);
  return (
    <Box>
      <Button variant="contained" sx={{
        mb : "2rem"
      }} onClick={navigateToCreateAuser}>
        Add a user
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headTitles.map((element, index) => {
                return <TableCell key={index}>{element}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user?.id}>
                  <TableCell>{user?.id}</TableCell>
                  <TableCell 
                  sx={{
                    
                  }}
                  onClick={()=>navigateToUserSomething("oneuser",user?.id)}>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.occupation}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <DeleteUser id={user?.id} setTrigg={setTrigg}/>
                      <IconButton title ="Modify" onClick={()=>navigateToUserSomething("modifyuser",user?.id)}>
                        <EditIcon/>
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Userlist;
