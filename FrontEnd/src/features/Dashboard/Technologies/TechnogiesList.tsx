import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import type { Technology } from "../../../Types/Technology.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteTechnology from "./DeleteTechnology.tsx";
import { api } from "../../../ApiService/ApiBrain.ts";

function TechnogiesList() {
  const navigate = useNavigate();
  const [trigg, setTrigg] = React.useState<boolean>(false);
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const limit: number = 8;

  const handleFetchTechnologies = async () => {
    try {
      const result: AxiosResponse<{
        total: number;
        page: number;
        lastPage: number;
        data: Technology[];
      }> = await api.get(`/api/technologies/paginate/${limit}/${page}`);
      setTechnologies(result.data.data);
      setTotal(result.data.total);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchTechnologies();
  }, [trigg, page]);

  const navigateToCreateTechnology = () =>
    navigate("/dashboard/createtechnology");

  const navigateToEditTechnology = (techId?: number) =>
    navigate("/dashboard/modifytechnology", { state: { id: techId } });

  const navigateToSomething = (partialPath: string, techId?: number) =>
    navigate(
      `/dashboard/${partialPath}`,
      techId ? { state: { id: techId } } : undefined,
    );

  return (
    <Box>
      <Button
        onClick={navigateToCreateTechnology}
        variant="outlined"
        sx={{
          mb: "2rem",
          px: 3,
          py: 1,
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        Add a Technology
      </Button>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.100" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Id</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tech-Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Score</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {technologies.map((tech, index) => (
              <TableRow
                key={index}
                sx={{ "&:hover": { backgroundColor: "grey.50" } }}
              >
                <TableCell>{tech?.id}</TableCell>
                <TableCell
                  sx={{
                    cursor: "pointer",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                      color: "primary.main",
                    },
                  }}
                  onClick={() => navigateToSomething("onetechnology", tech?.id)}
                >
                  {tech.name}
                </TableCell>
                <TableCell>{tech.technologyType}</TableCell>
                <TableCell>{tech.score}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DeleteTechnology id={tech?.id} setTrigg={setTrigg} />
                    <IconButton
                      title="Modify"
                      onClick={() => navigateToEditTechnology(tech?.id)}
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
    </Box>
  );
}

export default TechnogiesList;
