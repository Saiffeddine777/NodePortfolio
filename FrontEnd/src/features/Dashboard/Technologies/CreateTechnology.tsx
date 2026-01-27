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
  Paper,
  type SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { TechType, type Technology } from "../../../Types/Technology.ts";
import {
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier.ts";
import { useNavigate } from "react-router";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

function CreateTechnology({}: Props) {
  const navigate = useNavigate();

  const createdTech = React.useRef<Technology>({
    name: "",
    technologyType: TechType.TOOLS,
    score: 0,
    file: null,
  });

  const [techTypeState, setTechTypeState] = React.useState<TechType>(
    createdTech.current.technologyType,
  );
  const handleSelectChangeUI: (e: SelectChangeEvent) => void = (e) => {
    const value = e.target.value as TechType;
    setTechTypeState(value);
  };

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
      const result = await api.post(
        `/api/technologies/`,
        generateFromDataFromRefObject(createdTech),
      );
      result &&
        handleSuccess(
          "Inserting the Technology",
          "Success Inserting Technology",
        );
      navigateBackToTechnologies();
    } catch (error) {
      handleComponentError(error);
    }
  };

  return (
    <Box>
      {/* BACK BUTTON */}
      <Button
        variant="contained"
        sx={{ mb: 3, textTransform: "none", fontWeight: "bold" }}
        onClick={navigateBackToTechnologies}
      >
        Back to Technologies
      </Button>

      {/* FORM CARD */}
      <Paper
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 4,
          borderRadius: 3,
        }}
        elevation={3}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
        >
          Create a Technology Skill
        </Typography>

        {/* NAME */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>What did I learn</InputLabel>
          <Input
            onChange={(e) =>
              handleInputChangeIntoARefObject(createdTech, e, "name")
            }
          />
          <FormHelperText>Ex: Java</FormHelperText>
        </FormControl>

        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select a type</InputLabel>
          <Select
            value={techTypeState}
            onChange={(e) => {
              handleSelectChangeUI(e);
              handleInputChangeIntoARefObject(createdTech, e, "technologyType");
            }}
          >
            {arrayOftechTypes.map((element, index) => (
              <MenuItem key={index} value={element}>
                {element}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

     
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>I will give myself a score</InputLabel>
          <Input
            type="number"
            onChange={(e) =>
              handleInputChangeIntoARefObject(createdTech, e, "score")
            }
          />
          <FormHelperText>0 to 10</FormHelperText>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <Input
            type="file"
            onChange={(e) =>
              handleInputChangeIntoARefObject(createdTech, e, "file")
            }
          />
          <FormHelperText>Insert a referencing photo (optional)</FormHelperText>
        </FormControl>

        {/* SUBMIT */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            py: 1.4,
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={handleSubmit}
        >
          Submit Technology
        </Button>
      </Paper>
    </Box>
  );
}

export default CreateTechnology;
