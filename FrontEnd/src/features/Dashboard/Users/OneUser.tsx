import React from "react";
import type { User } from "../../../Types/User.ts";
import { type AxiosResponse } from "axios";
import { useLocation, useNavigate, type Location } from "react-router";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  Box,
  Typography,
  Card,
  Avatar,
  CardContent,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import DeleteUser from "./DeleteUser.tsx";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

const OneUser = ({}: Props) => {
  const navigate = useNavigate();
  const location: Location<{ id?: number }> = useLocation();
  const id = location.state.id;
  const [user, setUser] = React.useState<Partial<User> | null>(null);
  const handleFetchOneUser: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<Partial<User>> = await api.get(
        `/api/users/${id}`
      );
      setUser(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };
  const navigateToUsers: () => void = () => {
    navigate("/dashboard/userlist");
  };

  const navigateToModify: (id?: number) => void = (id) => {
    navigate("/dashboard/modifyuser", { state: { id: id } });
  };

  
  React.useEffect(() => {
    handleFetchOneUser();
  }, []);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
      bgcolor="#f5f6fa"
      p={2}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: "16px",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
          p: 2,
          background: "white",
        }}
      >
        <Button variant="text" onClick={navigateToUsers}>
          Back To Users
        </Button>
        <Box display="flex" justifyContent="center" mt={2}>
          <Avatar
            src={user?.imageUrl}
            alt={user?.firstName}
            sx={{ width: 100, height: 100, boxShadow: 2 }}
          />
        </Box>
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {user?.occupation}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="body1">
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {user?.phoneNumber}
            </Typography>
            <Typography variant="body1">
              <strong>Role:</strong> {user?.role}
            </Typography>
            <Typography variant="body1">
              <strong>User ID:</strong> {user?.id}
            </Typography>
          </Box>
          <DeleteUser id={user?.id} componentName={OneUser.name} />
          <IconButton onClick={() => navigateToModify(user?.id)}>
            <EditIcon />
          </IconButton>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OneUser;
