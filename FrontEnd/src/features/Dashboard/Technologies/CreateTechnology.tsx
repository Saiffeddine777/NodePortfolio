import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import React from "react";
import { TechType, type Technology } from "../../../Types/Technology";
import {
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier";
import { useNavigate } from "react-router";
import axios from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler";
import { handleSuccess } from "../../../Helpers/Sweetalert";

type Props = {};
const apiUrl = import.meta.env.VITE_API_URL;
function CreateTechnology({}: Props) {
  const navigate = useNavigate();
  const createdTech = React.useRef<Technology>({
    name: "",
    technologyType: TechType.TOOLS,
    score: 0,
    file: null,
  });

  const arrayOftechTypes: TechType[] = [
    TechType.BACKEND,
    TechType.DATABASE,
    TechType.FRONTEND,
    TechType.INFRASTRUCTURE,
    TechType.LANGUAGE,
    TechType.TOOLS,
  ];

  const navigateBackToTechnologies = () => {
    navigate("/dashboard/technologies");
  };

  const handleSubmit: () => Promise<void> = async () => {
    try {
      const result = await axios.post(
        `${apiUrl}/api/technologies/`,
        generateFromDataFromRefObject(createdTech)
      );
      result &&
        handleSuccess(
          "Inserting the Technology",
          "Success Inserting Technology"
        );
      navigateBackToTechnologies();
    } catch (error) {
      handleComponentError(error);
    }
  };
  return (
    <>
      <Button variant="contained" onClick={navigateBackToTechnologies}>
        back to Technologies
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifySelf: "center",
          marginTop: "-2%",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Create A technology Skill</Typography>
        <FormControl
          sx={{
            width: "200%",
          }}
        >
          <InputLabel htmlFor="my-input">What did I learn</InputLabel>
          <Input
            onChange={(e) =>
              handleInputChangeIntoARefObject(createdTech, e, "name")
            }
          />
          <FormHelperText id="my-helper-text">EX: java</FormHelperText>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select A type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={"Choose a Technologie"}
            label="Age"
            onChange={(e) =>
              handleInputChangeIntoARefObject(createdTech, e, "technologyType")
            }
          >
            {arrayOftechTypes.map((element, index) => {
              return (
                <MenuItem key={index} value={element}>
                  {element}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            width: "200%",
          }}
        >
          <InputLabel htmlFor="my-input">
            I will give My Self a Score
          </InputLabel>
          <Input
            onChange={(e) =>
              handleInputChangeIntoARefObject(createdTech, e, "score")
            }
          />
          <FormHelperText id="my-helper-text">0 TO 1</FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            width: "200%",
          }}
        >
          <Input
            onChange={(e) =>
              handleInputChangeIntoARefObject(createdTech, e, "file")
            }
            type="file"
          />
          <FormHelperText id="my-helper-text">
            Insert a referencing photo
          </FormHelperText>
        </FormControl>
        <Button variant="outlined" onClick={handleSubmit}>
          Submit Technology
        </Button>
      </Box>
    </>
  );
}

export default CreateTechnology;
