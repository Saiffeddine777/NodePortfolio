import React from "react";
import type { Project } from "../../../Types/Project";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteProject from "./DeleteProject";
import { useNavigate, type NavigateFunction } from "react-router";

type Props = {};
const apiUrl: string = import.meta.env.VITE_API_URL;
function ProjectList({}: Props) {
  const navigate:NavigateFunction = useNavigate()
  
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
      const result: AxiosResponse<Project[]> = await axios.get(
        `${apiUrl}/api/projects/`
      );
      setProjects(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };
  const navigateToOneProject : (id?:number)=>void = (id)=>{
    navigate("/dashboard/oneproject" ,{state:{
        id:id
    }})
  }
  React.useEffect(() => {
    handleFetchProjects();
  }, [trigg]);
  console.log(projects);
  return (
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
                <TableCell onClick={()=>navigateToOneProject(project.id)}>{project.projectName}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  <DeleteProject id={project.id} setTrigg={setTrigg} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProjectList;
