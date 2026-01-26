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
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import type { Technology } from "../../../Types/Technology.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteTechnology from "./DeleteTechnology.tsx";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

function TechnogiesList({}: Props) {
  const navigate = useNavigate();
  const [trigg, setTrigg] = React.useState<boolean>(false);
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);

  const handleFetchTechnologies: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<Technology[]> = await api.get(
        `/api/technologies`
      );
      setTechnologies(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToCreateTechnology = () => {
    navigate("/dashboard/createtechnology");
  };

  const navigateToEditTechnology = (techId?: number) => {
    navigate("/dashboard/modifytechnology", { state: { id: techId } });
  };

  const navigateToSomething = (partialPath: string, techId?: number): void => {
    navigate(
      `/dashboard/${partialPath}`,
      techId ? { state: { id: techId } } : undefined
    );
  };

  React.useEffect(() => {
    handleFetchTechnologies();
  }, [trigg]);

  return (
    <Box>
      {/* ACTION BUTTON */}
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

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "grey.100",
              }}
            >
              <TableCell sx={{ fontWeight: "bold" }}>Id</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tech-Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Score</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {technologies.map((tech, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "grey.50",
                    },
                  }}
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
                    onClick={() =>
                      navigateToSomething("onetechnology", tech?.id)
                    }
                  >
                    {tech.name}
                  </TableCell>

                  <TableCell>{tech.technologyType}</TableCell>
                  <TableCell>{tech.score}</TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <DeleteTechnology
                        id={tech?.id}
                        setTrigg={setTrigg}
                      />
                      <IconButton
                        title="Modify"
                        onClick={() =>
                          navigateToEditTechnology(tech?.id)
                        }
                      >
                        <EditIcon />
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
}

export default TechnogiesList;
