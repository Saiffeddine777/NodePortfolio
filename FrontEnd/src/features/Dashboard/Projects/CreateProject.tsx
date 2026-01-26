import React from "react";
import { ProjectCategory, type Project } from "../../../Types/Project.ts";
import {
  Box,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  TextField,
  Select,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import {
  generateData,
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

function CreateProject({}: Props) {
  const projectRef = React.useRef<Project>({
    projectName: "",
    githubUrl: "",
    liveUrl: "",
    published: false,
    description: "",
    techStack: [],
    category: ProjectCategory.WEB,
    file: undefined,
  });

  const handlePostProject: () => Promise<void> = async () => {
    try {
      const nonEmpty = generateData(projectRef.current);
      await api.post(
        `/api/projects`,
        nonEmpty.file
          ? generateFromDataFromRefObject({ current: nonEmpty })
          : nonEmpty
      );
      handleSuccess(
        "Project Inserted",
        "Project has been Successfully Inserted"
      );
    } catch (error) {
      handleComponentError(error);
    }
  };

  const handleTechStackChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void = (e) => {
    const value: string = e.target.value;
    projectRef.current.techStack = value.split(",").map((e) => e.trim());
  };

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
        >
          Create a Project
        </Typography>

        {/* PROJECT NAME */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Name of the project</InputLabel>
          <Input
            onChange={(e) =>
              handleInputChangeIntoARefObject(projectRef, e, "projectName")
            }
          />
          <FormHelperText>Example: Developer Portfolio</FormHelperText>
        </FormControl>

        {/* GITHUB */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Repository link</InputLabel>
          <Input
            onChange={(e) =>
              handleInputChangeIntoARefObject(projectRef, e, "githubUrl")
            }
          />
          <FormHelperText>
            https://github.com/username/project
          </FormHelperText>
        </FormControl>

        {/* LIVE URL */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Live link</InputLabel>
          <Input
            onChange={(e) =>
              handleInputChangeIntoARefObject(projectRef, e, "liveUrl")
            }
          />
          <FormHelperText>https://example.com</FormHelperText>
        </FormControl>

        {/* DESCRIPTION */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            multiline
            minRows={3}
            label="Describe the project"
            onChange={(e) =>
              handleInputChangeIntoARefObject(projectRef, e, "description")
            }
          />
          <FormHelperText>The story behind the project</FormHelperText>
        </FormControl>

        {/* TECH STACK */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Tech stack</InputLabel>
          <Input onChange={handleTechStackChange} />
          <FormHelperText>
            Spring Boot, Java, Angular, PostgreSQL
          </FormHelperText>
        </FormControl>

        {/* CATEGORY */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Project category</InputLabel>
          <Select
            value={projectRef.current.category}
            onChange={(e) =>
              handleInputChangeIntoARefObject(projectRef, e, "category")
            }
          >
            <MenuItem value={ProjectCategory.WEB}>
              {ProjectCategory.WEB}
            </MenuItem>
            <MenuItem value={ProjectCategory.API}>
              {ProjectCategory.API}
            </MenuItem>
            <MenuItem value={ProjectCategory.MOBILE}>
              {ProjectCategory.MOBILE}
            </MenuItem>
            <MenuItem value={ProjectCategory.OTHER}>
              {ProjectCategory.OTHER}
            </MenuItem>
          </Select>
          <FormHelperText>
            What kind of project was this?
          </FormHelperText>
        </FormControl>

        {/* IMAGE */}
        <FormControl fullWidth sx={{ mb: 4 }}>
          <Input
            type="file"
            onChange={(e) =>
              handleInputChangeIntoARefObject(projectRef, e, "file")
            }
          />
          <FormHelperText>Project preview image</FormHelperText>
        </FormControl>

        {/* SUBMIT */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            py: 1.4,
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={handlePostProject}
        >
          Submit Project
        </Button>
      </Paper>
    </Box>
  );
}

export default CreateProject;
