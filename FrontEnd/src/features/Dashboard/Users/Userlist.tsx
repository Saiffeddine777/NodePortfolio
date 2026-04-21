import {
  Box,
  Button,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { AxiosResponse } from "axios";
import React from "react";
import { useNavigate } from "react-router";
import type { User } from "../../../Types/User.tsx";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import DeleteUser from "./DeleteUser.tsx";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

const Userlist = ({}: Props) => {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState<User[]>([]);
  const [trigg, setTrigg] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const limit: number = 6;
  const navigateToCreateAuser = () => {
    navigate("/dashboard/createuser");
  };

  const headTitles: string[] = [
    "ID",
    "First Name",
    "Last Name",
    "Occupation",
    "Actions",
  ];

  const fetchUserList: () => Promise<void> = async () => {
    try {
      const response: AxiosResponse<{
        data: User[];
        page: number;
        lastPage: number;
        total: number;
      }> = await api.get(`/api/users/getpaginatedusers/${limit}/${page}`);
      setUsers(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToUserSomething: (path: string, id?: number) => void = (
    path,
    id,
  ) => {
    navigate(`/dashboard/${path}`, {
      state: { id: id },
    });
  };

  React.useEffect(() => {
    fetchUserList();
  }, [trigg, page]);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Users
        </Typography>

        <Button
          variant="contained"
          onClick={navigateToCreateAuser}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 2,
          }}
        >
          Add user
        </Button>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headTitles.map((element, index) => (
                <TableCell key={index} sx={{ fontWeight: "bold" }}>
                  {element}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user?.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <TableCell sx={{ color: "text.secondary" }}>
                  #{user?.id}
                </TableCell>

                <TableCell
                  onClick={() => navigateToUserSomething("oneuser", user?.id)}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 500,
                    color: "primary.main",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {user.firstName}
                </TableCell>

                <TableCell>{user.lastName}</TableCell>

                <TableCell>{user.occupation}</TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <DeleteUser id={user?.id} setTrigg={setTrigg} />

                    <IconButton
                      title="Modify"
                      onClick={() =>
                        navigateToUserSomething("modifyuser", user?.id)
                      }
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ pb: 4 }}>
        {" "}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default Userlist;
