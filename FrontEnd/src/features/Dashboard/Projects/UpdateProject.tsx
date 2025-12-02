import React from "react";
import { useLocation, type Location } from "react-router";
import type { Project } from "../../../Types/Project.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  Box,
  Button,
  Typography,
  FormControl,
  Input,
  InputLabel,
  TextField,
  Switch,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import {
  generateData,
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier.ts";
import { Add, Close, UploadFile } from "@mui/icons-material";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

function UpdateProject({}: Props) {
  const location: Location<{ id?: number }> = useLocation();
  const id: number | undefined = location.state.id;

  const [projectToEdit, setProjectToEdit] = React.useState<Project | null>(
    null
  );

  const [trigg, setTrigg] = React.useState<boolean>(false);

  const data = React.useRef<Partial<Project>>({});
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [addedTechStak, setAddedTechStack] = React.useState<string>("");

  const fetchTheProjectToEdit: () => Promise<void> = async () => {
    try {
      const response: AxiosResponse<Project> = await api.get(
        `/api/projects/${id}`
      );
      setProjectToEdit(response.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const applyChanges: () => Promise<void> = async () => {
    try {
      await api.put(
        `/api/projects/${id}`,
        data.current.file
          ? generateFromDataFromRefObject(data).append(
              "publicId",
              projectToEdit?.publicId as string
            )
          : { ...generateData(data.current), publicId: projectToEdit?.publicId }
      );
      handleSuccess("Success", "The Project has been updated");
      setTrigg(!trigg);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const handleToggleChange: () => void = () => {
    data.current.published = !projectToEdit?.published;
    setProjectToEdit((state) => {
      return state
        ? {
            ...state,
            published: !state?.published,
          }
        : null;
    });
  };

  const handleDeletedChip: (value: string) => void = (value) => {
    const filterFunc: (proj: Project) => string[] = (proj) => {
      const stack: string[] = proj.techStack.filter((val) => val !== value);
      data.current.techStack = stack;
      return stack;
    };
    setProjectToEdit((state) => {
      return state
        ? {
            ...state,
            techStack: filterFunc(state),
          }
        : null;
    });
  };

  const handleAddingTechStackElement: () => void = () => {
    data.current.techStack = projectToEdit?.techStack;
    data.current.techStack?.push(addedTechStak);
    setProjectToEdit((state) => {
      return state
        ? {
            ...state,
            techStack: data.current.techStack ?? [],
          }
        : null;
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddingTechStackElement();
    }
  };

  React.useEffect(() => {
    fetchTheProjectToEdit();
    data.current.publicId = projectToEdit?.publicId;
  }, [trigg]);

  return (
    <Box
      sx={{
        mt: "-3rem",
      }}
    >
      <Box>
        <Box
          sx={{
            mt: "1rem",
          }}
        >
          <Typography>{projectToEdit?.projectName}</Typography>
          <FormControl
            sx={{
              width: "20%",
            }}
          >
            <InputLabel htmlFor="my-input">Email address</InputLabel>
            <Input
              onChange={(e) =>
                handleInputChangeIntoARefObject(data, e, "projectName")
              }
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            mt: "1rem",
          }}
        >
          <Typography>{projectToEdit?.liveUrl}</Typography>
          <FormControl
            sx={{
              width: "20%",
            }}
          >
            <InputLabel htmlFor="my-input">New url</InputLabel>
            <Input
              onChange={(e) =>
                handleInputChangeIntoARefObject(data, e, "liveUrl")
              }
            />
          </FormControl>
        </Box>

        <Box
          sx={{
            mt: "1rem",
          }}
        >
          <Typography>{projectToEdit?.githubUrl}</Typography>
          <FormControl
            sx={{
              width: "20%",
            }}
          >
            <InputLabel htmlFor="my-input">New Github Repo</InputLabel>
            <Input
              onChange={(e) =>
                handleInputChangeIntoARefObject(data, e, "githubUrl")
              }
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            mt: "1rem",
          }}
        >
          <Typography>{projectToEdit?.description}</Typography>
          <FormControl
            sx={{
              width: "100%",
            }}
          >
            <TextField
              label="Describe the poject one more time"
              onChange={(e) =>
                handleInputChangeIntoARefObject(data, e, "description")
              }
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            mt: "1rem",
          }}
        >
          <Typography>
            {projectToEdit?.published ? "Published" : "Unpublished"}
          </Typography>
          <Switch
            checked={projectToEdit?.published}
            value={projectToEdit?.published}
            onChange={handleToggleChange}
            slotProps={{ input: { "aria-label": "controlled" } }}
          />
        </Box>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleInputChangeIntoARefObject(data, e, "file")}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadFile />}
          onClick={handleButtonClick}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          Upload File
        </Button>
        <Box
          sx={{
            mt: "1rem",
          }}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Add Technology"
                variant="outlined"
                size="small"
                value={addedTechStak}
                onChange={(e) => setAddedTechStack(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleAddingTechStackElement}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <Add />
              </IconButton>
            </Stack>
            {projectToEdit?.techStack.map((val, index) => {
              return (
                <Chip
                  key={index}
                  label={val}
                  color="primary"
                  onDelete={() => handleDeletedChip(val)}
                  deleteIcon={<Close fontSize="small" />}
                  sx={{
                    ml: 1,
                    mb: 1,
                    transition: "all 0.2s ease",
                    "& .MuiChip-deleteIcon": {
                      opacity: 0, // hidden by default
                      transition: "opacity 0.2s ease",
                    },
                    "&:hover .MuiChip-deleteIcon": {
                      opacity: 1, // visible on hover
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

      <Button
        onClick={applyChanges}
        sx={{
          mt: "1rem",
        }}
        variant="contained"
      >
        Submit
      </Button>
    </Box>
  );
}

export default UpdateProject;
