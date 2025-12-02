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
        nonEmpty.file? generateFromDataFromRefObject({ current: nonEmpty }) : nonEmpty
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
    projectRef.current.techStack = value.split(",").map(e=>{
      return e.trim()
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifySelf: "center",
      }}
    >
      <FormControl
        sx={{
          width: "150%",
        }}
      >
        <InputLabel htmlFor="my-input">Name of the project</InputLabel>
        <Input
          onChange={(e) =>
            handleInputChangeIntoARefObject(projectRef, e, "projectName")
          }
        />
        <FormHelperText id="my-helper-text">developer portfolio</FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          width: "150%",
        }}
      >
        <InputLabel htmlFor="my-input">What is the Repo link</InputLabel>
        <Input
          onChange={(e) =>
            handleInputChangeIntoARefObject(projectRef, e, "githubUrl")
          }
        />
        <FormHelperText id="my-helper-text">
          https://github.com/profile/projectrepo
        </FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          width: "150%",
        }}
      >
        <InputLabel htmlFor="my-input">Live link</InputLabel>
        <Input
          onChange={(e) =>
            handleInputChangeIntoARefObject(projectRef, e, "liveUrl")
          }
        />
        <FormHelperText id="my-helper-text">https://example.com</FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          width: "150%",
          height: "4rem",
        }}
      >
        <TextField
          label={"Describe the project to us"}
          onChange={(e) =>
            handleInputChangeIntoARefObject(projectRef, e, "description")
          }
          sx={{
            height: "4rem",
          }}
        />
        <FormHelperText id="my-helper-text">
          The story of the project
        </FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          width: "150%",
        }}
      >
        <InputLabel htmlFor="my-input">
          What did use to create this project
        </InputLabel>
        <Input onChange={(e) => handleTechStackChange(e)} />
        <FormHelperText id="my-helper-text">
          Spring boot , java , Angular...{" "}
        </FormHelperText>
      </FormControl>

      <FormControl
        sx={{
          width: "150%",
        }}
      >
        <InputLabel htmlFor="my-input">
          Select the type of this project{" "}
        </InputLabel>
        <Select
          onChange={(e) =>
            handleInputChangeIntoARefObject(projectRef, e, "category")
          }
        >
          <MenuItem value={ProjectCategory.WEB}>{ProjectCategory.WEB}</MenuItem>
          <MenuItem value={ProjectCategory.API}>{ProjectCategory.API}</MenuItem>
          <MenuItem value={ProjectCategory.MOBILE}>
            {ProjectCategory.MOBILE}
          </MenuItem>
          <MenuItem value={ProjectCategory.OTHER}>
            {ProjectCategory.OTHER}
          </MenuItem>
        </Select>
        <FormHelperText id="my-helper-text">
          What was the project in nature?{" "}
        </FormHelperText>
      </FormControl>

      <FormControl
        sx={{
          width: "150%",
        }}
      >
        <Input
          onChange={(e) =>
            handleInputChangeIntoARefObject(projectRef, e, "file")
          }
          type="file"
        />
        <FormHelperText id="my-helper-text">Select an Image</FormHelperText>
      </FormControl>
      <Button onClick={handlePostProject}>Submit the Project</Button>
    </Box>
  );
}

export default CreateProject;
