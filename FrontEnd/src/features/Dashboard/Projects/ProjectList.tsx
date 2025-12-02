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
    "id",
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
  const navigateToOneProject: (id?: number) => void = (id) => {
    navigate("/dashboard/oneproject", {
      state: {
        id: id,
      },
    });
  };

  const navigateToCreateAProject: () => void = () => {
    navigate("/dashboard/createproject");
  };

  const navigateSomeWhere: (unSlachedPath: string, id?: number) => void = (unSlachedPath, id) => {
    navigate(`/dashboard/${unSlachedPath}`, id ? { state: { id: id } } : undefined);
  };

  React.useEffect(() => {
    handleFetchProjects();
  }, [trigg]);

  console.log(projects);
  return (
    <Box>
      <Button
        sx={{
          mb: "2rem",
        }}
        onClick={navigateToCreateAProject}
        variant="contained"
      >
        Create a Project
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {arrayOfColumns.map((element, index) => {
                return <TableCell key={index}>{element}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => navigateToOneProject(project.id)}
                  >
                    {project.projectName}
                  </TableCell>
                  <TableCell
                    sx={{
                      cursor: "default",
                    }}
                  >
                    {project.category}
                  </TableCell>
                  <TableCell>
                    <IconButton
                     onClick={
                      ()=>navigateSomeWhere("updateproject" , project.id)
                     }
                    >
                      <EditIcon/>
                    </IconButton>
                    <DeleteProject id={project.id} setTrigg={setTrigg} />
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
