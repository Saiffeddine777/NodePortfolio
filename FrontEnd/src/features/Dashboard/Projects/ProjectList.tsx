import React from "react";
import type { Project } from "../../../Types/Project.tsx";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteProject from "./DeleteProject.tsx";
import { useNavigate, type NavigateFunction } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

function ProjectList({}: Props) {
  const navigate: NavigateFunction = useNavigate();

  const [projects, setProjects] = React.useState<Project[]>([]);
  const [trigg, setTrigg] = React.useState<boolean>(false);

  const arrayOfColumns: string[] = [
    "Id",
    "Project Name",
    "Category",
    "Actions",
  ];

  const handleFetchProjects: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<Project[]> = await api.get(
        `/api/projects/`
      );
      setProjects(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToOneProject = (id?: number): void => {
    navigate("/dashboard/oneproject", {
      state: { id },
    });
  };

  const navigateToCreateAProject = (): void => {
    navigate("/dashboard/createproject");
  };

  const navigateSomeWhere = (
    unSlachedPath: string,
    id?: number
  ): void => {
    navigate(
      `/dashboard/${unSlachedPath}`,
      id ? { state: { id } } : undefined
    );
  };

  React.useEffect(() => {
    handleFetchProjects();
  }, [trigg]);

  return (
    <Box>
      {/* ACTION BUTTON */}
      <Button
        sx={{
          mb: "2rem",
          px: 3,
          py: 1,
          fontWeight: "bold",
          textTransform: "none",
        }}
        onClick={navigateToCreateAProject}
        variant="contained"
      >
        Create a Project
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
              {arrayOfColumns.map((element, index) => {
                return (
                  <TableCell
                    key={index}
                    sx={{ fontWeight: "bold" }}
                  >
                    {element}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.map((project, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "grey.50",
                    },
                  }}
                >
                  <TableCell>{project.id}</TableCell>

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
                      navigateToOneProject(project.id)
                    }
                  >
                    {project.projectName}
                  </TableCell>

                  <TableCell>{project.category}</TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        title="Modify"
                        onClick={() =>
                          navigateSomeWhere(
                            "updateproject",
                            project.id
                          )
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <DeleteProject
                        id={project.id}
                        setTrigg={setTrigg}
                      />
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

export default ProjectList;
